import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { distinctUntilChanged, filter, map, Subject } from "rxjs";
import { SocketService } from "./socket.service";
import {
    EndTurnAction,
    JoinRoomAction,
    JoinRoomSuccessData,
    RollDiceAction,
    SelectDiceAction,
    SetDiceAsideAction,
    WebSocketErrorEvent,
    WebSocketSuccessEvent,
} from "./types";

@Injectable({
    providedIn: "root",
})
export class GameService {
    private readonly router = inject(Router);
    private readonly socketService = inject(SocketService);
    readonly joined$ = new Subject<JoinRoomSuccessData>();
    readonly gameState$ = this.socketService.messages$.pipe(
        filter((msg) => msg.type === "game_state"),
        map((msg) => msg.data),
    );
    readonly currentDice$ = this.gameState$.pipe(
        map((state) => state.dice),
        distinctUntilChanged((prev, curr) => {
            // Return true if arrays are equal (to prevent emission)
            if (!prev || !curr) return prev === curr;
            if (prev.length !== curr.length) return false;
            return prev.every((value, index) => value === curr[index]);
        }),
    );

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

    selectDice(diceIndex: number) {
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
}
