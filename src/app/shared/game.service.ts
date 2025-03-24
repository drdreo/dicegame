import { inject, Injectable } from "@angular/core";
import { filter, map } from "rxjs";
import { SocketService } from "./socket.service";
import {
    CreateRoomAction,
    JoinedData,
    JoinRoomAction,
    ReconnectedData,
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
    readonly gameState$ = this.socketService.messages$.pipe(
        filter((msg) => msg.type === "game_state"),
        map((msg) => msg.data),
    );

    constructor() {
        this.socketService.messages$.subscribe((msg) => {
            if (
                (msg.type === "error" || msg.type === "create_room_result" || msg.type === "join_room_result") &&
                !msg.success
            ) {
                this.handleErrorMessage(msg);
            } else {
                this.handleMessage(msg);
            }
        });
    }

    createRoom(roomId: string | undefined): void {
        const action: CreateRoomAction = {
            type: "create_room",
            data: {
                roomId,
                gameType: "dicegame",
            },
        };
        this.socketService.sendMessage(action);
    }

    joinRoom(roomId: string): void {
        const action: JoinRoomAction = {
            type: "join_room",
            data: {
                roomId,
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

    private handleErrorMessage(message: WebSocketErrorEvent) {
        console.error("Game error:", message.error);
    }

    private handleMessage(message: WebSocketSuccessEvent): void {
        switch (message.type) {
            case "temp_score":
                this.handleTempScore(message.data);
                break;
            case "joined":
                this.handleJoined(message.data);
                break;
            case "reconnected":
                this.handleReconnected(message.data);
                break;
            default:
                console.log("Unknown room message type:", message.type);
        }
    }

    private handleTempScore(data: TmpScoreData): void {
        // Implement temp score handling
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
    }

    private handleReconnected(data: ReconnectedData): void {
        if (!data) {
            console.warn("Received reconnected message with no data");
            return;
        }

        if (!data.clientId) {
            console.warn("Reconnected message missing clientId:", data);
            return;
        }
    }
}
