import { effect, Injectable, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, filter, ReplaySubject, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import {
    JoinRoomSuccessData,
    ReconnectAction,
    WebSocketActions,
    WebSocketMessage,
    WebSocketSuccessEvent
} from "./types";

@Injectable({
    providedIn: "root"
})
export class SocketService {
    joined$ = new Subject<JoinRoomSuccessData>();
    reconnected$ = new Subject<JoinRoomSuccessData>();
    clientId = signal<string | undefined | null>(sessionStorage.getItem("clientId"));
    roomId = signal<string | undefined | null>(sessionStorage.getItem("roomId"));
    private socket: WebSocket | null = null;
    private _connectionStatus$ = new BehaviorSubject<number>(WebSocket.CLOSED);
    readonly connectionStatus = toSignal(this._connectionStatus$);
    private _messages$ = new ReplaySubject<WebSocketMessage>(1);
    readonly messages$ = this._messages$.asObservable();
    successMessages$ = this._messages$.pipe(filter((msg) => msg.success));

    constructor() {
        this.connectWebSocket();

        this.successMessages$.subscribe((msg) => {
            this.handleSuccessMessage(msg);
        });

        effect(() => {
            const clientId = this.clientId();
            if (clientId) {
                sessionStorage.setItem("clientId", clientId);
            } else {
                sessionStorage.removeItem("clientId");
            }
        });

        effect(() => {
            const roomId = this.roomId();
            if (roomId) {
                sessionStorage.setItem("roomId", roomId);
            } else {
                sessionStorage.removeItem("roomId");
            }
        });
    }

    sendMessage(message: WebSocketActions): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not connected");
        }
    }

    checkReconnect() {
        const clientId = this.clientId();
        const roomId = this.roomId();

        if (clientId && roomId && this.socket) {
            const message: ReconnectAction = {
                type: "reconnect",
                data: {
                    roomId,
                    clientId
                }
            };

            this.sendMessage(message);
        }
    }

    disconnect(): void {
        this.socket?.close();
    }

    private connectWebSocket = () => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        let gameServerUrl = environment.gameServerUrl;
        if (environment.stage === "development") {
            gameServerUrl = window.location.hostname + gameServerUrl;
        }
        const wsUrl = `${protocol}//${gameServerUrl}/ws?game=dicegame`;

        console.debug("Connecting to WebSocket server at:", wsUrl);
        this.socket = new WebSocket(wsUrl);

        this.socket.onmessage = (event: MessageEvent<string>) => {
            const messages = JSON.parse(event.data) as WebSocketMessage[];
            for (const msg of messages) {
                this._messages$.next(msg);
            }
        };

        this.socket.onclose = () => {
            console.debug("WebSocket connection closed");
            this._connectionStatus$.next(WebSocket.CLOSED);
            setTimeout(this.connectWebSocket, 3000);
        };

        this.socket.onerror = (error: Event) => {
            console.error("WebSocket Error: ", error);
        };

        this.socket.onopen = () => {
            console.debug("WebSocket connection established");
            this._connectionStatus$.next(WebSocket.OPEN);

            // Add a delay before checking reconnect to prevent subscription race conditions
            setTimeout(() => {
                this.checkReconnect();
            }, 200);
        };
    };

    private handleSuccessMessage(event: WebSocketSuccessEvent): void {
        switch (event.type) {
            case "join_room_result":
                this.handleJoinRoom(event.data);
                this.joined$.next(event.data);
                break;
            case "reconnect_result":
                this.handleJoinRoom(event.data);
                this.reconnected$.next(event.data);
                break;
        }
    }

    private handleJoinRoom(data: JoinRoomSuccessData): void {
        if (!data) {
            console.warn("Received join_room_result with no data");
            return;
        }

        if (!data.clientId) {
            console.warn("join_room_result message missing clientId:", data);
            return;
        }

        if (!data.roomId) {
            console.warn("join_room_result message missing roomId:", data);
            return;
        }

        console.log("Joined room:", data.roomId);
        this.clientId.set(data.clientId);
        this.roomId.set(data.roomId);
    }
}
