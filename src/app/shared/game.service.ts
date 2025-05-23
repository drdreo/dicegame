import { computed, effect, inject, Injectable, linkedSignal, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { filter, map } from "rxjs";
import { DialogService } from "./notifications/dialog.service";
import { SocketService } from "./socket.service";
import {
    AddBotAction,
    EndTurnAction,
    GetRoomListAction,
    JoinRoomAction,
    LeaveRoomAction,
    RollDiceAction,
    SelectDiceAction,
    SetDiceAsideAction,
    WebSocketErrorEvent,
    WebSocketSuccessEvent
} from "./types";

function areDiceEqual(prev: number[], curr: number[]): boolean {
    if (!prev || !curr) return prev === curr;
    if (prev.length !== curr.length) return false;
    return prev.every((value, index) => value === curr[index]);
}

@Injectable({
    providedIn: "root"
})
export class GameService {
    private readonly router = inject(Router);
    private readonly socketService = inject(SocketService);
    private readonly notificationService = inject(DialogService);

    roomList = toSignal(
        this.socketService.messages$.pipe(
            filter((msg) => msg.type === "room_list_update"),
            map((msg) => msg.data)
        )
    );

    gameState = toSignal(
        this.socketService.messages$.pipe(
            filter((msg) => msg.type === "game_state"),
            map((msg) => msg.data)
        )
    );

    started = computed(() => {
        const state = this.gameState();
        if (!state) return false;
        return state.started;
    });

    currentDice = computed(
        () => {
            const state = this.gameState();
            if (!state) return [];
            return state.dice;
        },
        { equal: areDiceEqual }
    );

    selectedDice = computed(
        () => {
            const state = this.gameState();
            if (!state) return [];
            return state.selectedDice;
        },
        { equal: areDiceEqual }
    );

    setAsideDice = computed(
        () => {
            const state = this.gameState();
            if (!state) return [];
            return state.setAside;
        },
        { equal: areDiceEqual }
    );

    player = computed(() => {
        const playerId = this.socketService.clientId();
        const gameState = this.gameState();
        if (!playerId || !gameState) return undefined;
        return gameState.players[playerId];
    });

    enemy = computed(() => {
        const playerId = this.socketService.clientId();
        const gameState = this.gameState();
        if (!playerId || !gameState) return undefined;
        return Object.values(gameState.players).find((player) => player.id !== playerId);
    });

    currentPlayer = computed(
        () => {
            const state = this.gameState();
            if (!state) return undefined;
            return state.players[state.currentTurn];
        },
        { equal: (p1, p2) => p1?.id === p2?.id }
    );

    winner = computed(() => {
        const state = this.gameState();
        if (!state) return undefined;
        return state.winner || undefined;
    });

    isYourTurn = computed(() => {
        const currentPlayer = this.currentPlayer();
        const player = this.player();
        if (!currentPlayer || !player) return false;
        return currentPlayer.id === player.id;
    });

    isRolling = signal(false);

    // TODO: Fix the bug that isRolling doesnt reset when the dice roll is skipped too quickly.
    // doesnt work
    isRollingCopy = linkedSignal({
        source: this.currentPlayer,
        computation: (newPlayer, previous) => {
            if (!previous || newPlayer?.id !== previous.source?.id) {
                return false;
            }
            return previous.value;
        }
    });

    constructor() {
        this.socketService.messages$.subscribe((msg) => {
            if (
                (msg.type === "error" ||
                    msg.type === "create_room_result" ||
                    msg.type === "join_room_result" ||
                    msg.type === "leave_room_result" ||
                    msg.type === "add_bot_result" ||
                    msg.type === "reconnect_result") &&
                !msg.success
            ) {
                this.handleErrorMessage(msg);
            } else {
                this.handleSuccessMessage(msg);
            }
        });

        effect(() => {
            const currentPlayer = this.currentPlayer();
            console.debug("Current player:", currentPlayer?.name);
            this.isRolling.set(false);
        });
    }

    joinRoom(playerName: string, roomId?: string): void {
        const action: JoinRoomAction = {
            type: "join_room",
            data: {
                roomId,
                playerName,
                gameType: "dicegame"
            }
        };
        this.socketService.sendMessage(action);
    }

    leaveRoom(): void {
        const action: LeaveRoomAction = {
            type: "leave_room"
        };
        this.socketService.sendMessage(action);
    }

    requestRoomList() {
        const action: GetRoomListAction = {
            type: "get_room_list",
            data: {
                gameType: "dicegame"
            }
        };
        this.socketService.sendMessage(action);
    }

    addBot() {
        const action: AddBotAction = {
            type: "add_bot"
        };
        this.socketService.sendMessage(action);
    }

    rollDice() {
        const action: RollDiceAction = {
            type: "roll"
        };
        this.socketService.sendMessage(action);
    }

    selectDice(diceIndex: number) {
        const action: SelectDiceAction = {
            type: "select",
            data: {
                diceIndex
            }
        };
        this.socketService.sendMessage(action);
    }

    setDiceAside(endTurn: boolean) {
        const action: SetDiceAsideAction = {
            type: "set_aside",
            data: {
                endTurn
            }
        };
        this.socketService.sendMessage(action);
    }

    endTurn() {
        const action: EndTurnAction = {
            type: "end_turn"
        };
        this.socketService.sendMessage(action);
    }

    private handleErrorMessage(message: WebSocketErrorEvent) {
        console.error("Game error:", message.error);
        switch (message.type) {
            case "error":
                this.notificationService.notify(message.error, { autoClose: 3500 });
                break;
            case "reconnect_result":
                this.socketService.clientId.set(undefined);
                this.socketService.roomId.set(undefined);
                this.router.navigate(["/"]);
                break;
            default:
                console.log("Unknown room message type:", message.type);
        }
    }

    private handleSuccessMessage(event: WebSocketSuccessEvent): void {
        switch (event.type) {
            case "busted":
                this.notificationService.showBusted(event.data.name);
                break;

            case "leave_room_result":
                this.router.navigate(["/"]); // Navigate to home
                break;
            case "reconnect_result":
            case "game_state":
                break;
            default:
                console.debug("Unknown room event type:", event.type);
        }
    }
}
