import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { filter, map, Subject } from "rxjs";
import { SocketService } from "./socket.service";
import {
    JoinedData,
    JoinRoomAction,
    ReconnectSuccessData,
    RollAction,
    TmpScoreData,
    WebSocketErrorEvent,
    WebSocketSuccessEvent,
} from "./types";

@Injectable({
    providedIn: "root",
})
export class GameService {
    private readonly socketService = inject(SocketService);
    readonly joined$ = new Subject<JoinedData>();
    readonly currentDice$ = this.gameState$.pipe(map((state) => state.dice));
    readonly gameState$ = this.socketService.messages$.pipe(
        filter((msg) => msg.type === "game_state"),
        map((msg) => msg.data),
    );
    private readonly router = inject(Router);

    constructor() {
        this.socketService.messages$.subscribe((msg) => {
            if (
                (msg.type === "error" ||
                    msg.type === "create_room_result" ||
                    msg.type === "join_room_result" ||
                    msg.type === "reconnect_result") &&
                !msg.success
            ) {
                this.handleErrorMessage(msg);
            } else {
                this.handleMessage(msg);
            }
        });
    }

    joinRoom(playerName: string, roomId?: string): void {
        const action: JoinRoomAction = {
            type: "join_room",
            data: {
                roomId,
                playerName,
                gameType: "dicegame",
            },
        };
        this.socketService.sendMessage(action);
    }

    sendRollAction(): void {
        const action: RollAction = {
            type: "roll",
        };
        this.socketService.sendMessage(action);
    }

    rollDice() {
        const action: RollAction = {
            type: "roll",
        };
        this.socketService.sendMessage(action);
    }

    private handleErrorMessage(message: WebSocketErrorEvent) {
        console.error("Game error:", message.error);
        switch (message.type) {
            case "reconnect_result":
                this.socketService.clientId = undefined;
                this.socketService.roomId = undefined;
                this.router.navigate(["/"]);
                break;
            default:
                console.log("Unknown room message type:", message.type);
        }
    }

    private handleTempScore(data: TmpScoreData): void {
        // Implement temp score handling
    }

    private handleMessage(message: WebSocketSuccessEvent): void {
        switch (message.type) {
            case "joined":
                this.handleJoined(message.data);
                break;
            case "reconnect_result":
                this.handleJoined(message.data);
                break;
            case "temp_score":
                this.handleTempScore(message.data);
                break;
            case "game_state":
                break;
            case "join_room_result":
                break;
            default:
                console.log("Unknown room message type:", message.type);
        }
    }

    private handleJoined(data: JoinedData): void {
        if (!data) {
            console.warn("Received joined message with no data");
            return;
        }

        if (!data.clientId) {
            console.warn("Joined message missing clientId:", data);
            return;
        }

        this.socketService.clientId = data.clientId;
        this.socketService.roomId = data.roomId;
        this.joined$.next(data);
    }

    private handleReconnected(data: ReconnectSuccessData): void {
        if (!data) {
            console.warn("Received reconnected message with no data");
            return;
        }

        if (!data.clientId) {
            console.warn("Reconnected message missing clientId:", data);
            return;
        }

        this.socketService.clientId = data.clientId;
        this.socketService.roomId = data.roomId;
    }
}
