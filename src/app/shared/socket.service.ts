import { Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { ReconnectAction, WebSocketActions, WebSocketMessage } from "./types";

@Injectable({
    providedIn: "root"
})
export class SocketService {
    private socket: WebSocket | null = null;
    private _connectionStatus$ = new BehaviorSubject<number>(WebSocket.CLOSED);
    readonly connectionStatus = toSignal(this._connectionStatus$);
    private _messages$ = new Subject<WebSocketMessage>();
    readonly messages$ = this._messages$.asObservable();

    constructor() {
        this.connectWebSocket();
    }

    private _clientId: string | undefined = undefined;

    get clientId(): string | undefined {
        const storedId = sessionStorage.getItem("clientId");
        return storedId ?? this._clientId;
    }

    set clientId(id: string | undefined) {
        if (id) {
            sessionStorage.setItem("clientId", id);
        } else {
            sessionStorage.removeItem("clientId");
        }

        this._clientId = id;
    }

    private _roomId: string | undefined = undefined;

    get roomId(): string | undefined {
        const storedId = sessionStorage.getItem("roomId");
        return storedId ?? this._roomId;
    }

    set roomId(id: string | undefined) {
        if (id) {
            sessionStorage.setItem("roomId", id);
        } else {
            sessionStorage.removeItem("roomId");
        }
        this._roomId = id;
    }

    sendMessage(message: WebSocketActions): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not connected");
        }
    }

    checkReconnect() {
        const clientId = this.clientId;
        const roomId = this.roomId;

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
        const wsUrl = `${protocol}//${environment.gameServerUrl}/ws?game=dicegame`;

        console.debug("Connecting to WebSocket server at:", wsUrl);
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.debug("WebSocket connection established");
            this._connectionStatus$.next(WebSocket.OPEN);
            this.checkReconnect();
        };

        this.socket.onclose = () => {
            console.debug("WebSocket connection closed");
            this._connectionStatus$.next(WebSocket.CLOSED);
            setTimeout(this.connectWebSocket, 3000);
        };

        this.socket.onerror = (error: Event) => {
            console.error("WebSocket Error: ", error);
        };

        this.socket.onmessage = (event: MessageEvent<string>) => {
            const messages = JSON.parse(event.data) as WebSocketMessage[];
            for (const msg of messages) {
                this._messages$.next(msg);
            }
        };
    };
}
