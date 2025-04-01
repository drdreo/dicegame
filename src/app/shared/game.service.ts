import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { filter, map, Subject } from "rxjs";
import { SocketService } from "./socket.service";
import {
    EndTurnAction,
    JoinedData,
    JoinRoomAction,
    JoinRoomSuccessData,
    RollDiceAction,
    SelectDiceAction,
    SetDiceAsideAction,
    TmpScoreData,
    WebSocketErrorEvent,
    WebSocketSuccessEvent,
} from "./types";

@Injectable({
    providedIn: "root",
})
export class GameService {
    readonly joined$ = new Subject<JoinedData>();
    readonly currentDice$ = this.gameState$.pipe(map((state) => state.dice));
    readonly gameState$ = this.socketService.messages$.pipe(
        filter((msg) => msg.type === "game_state"),
        map((msg) => msg.data),
    );
    private readonly socketService = inject(SocketService);
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
                this.handleSuccessMessage(msg);
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

    rollDice() {
        const action: RollDiceAction = {
            type: "roll",
        };
        this.socketService.sendMessage(action);
    }

    selectDice(diceIndex: number[]) {
        const action: SelectDiceAction = {
            type: "select",
            data: {
                diceIndex,
            },
        };
        this.socketService.sendMessage(action);
    }

    setDiceAside(diceIndex: number[]) {
        const action: SetDiceAsideAction = {
            type: "set_aside",
            data: {
                diceIndex,
            },
        };
        this.socketService.sendMessage(action);
    }

    endTurn() {
        const action: EndTurnAction = {
            type: "end_turn",
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

    private handleSuccessMessage(event: WebSocketSuccessEvent): void {
        switch (event.type) {
            case "join_room_result":
            case "reconnect_result":
                this.handleJoinRoom(event.data);
                break;

            case "game_state":
                break;
            case "temp_score":
                this.handleTempScore(event.data);
                break;
            default:
                console.log("Unknown room event type:", event.type);
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

        this.socketService.clientId = data.clientId;
        this.socketService.roomId = data.roomId;
        this.joined$.next(data);
    }

    private handleTempScore(data: TmpScoreData): void {
        // Implement temp score handling
    }
}
