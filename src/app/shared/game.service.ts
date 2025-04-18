import { computed, effect, inject, Injectable, linkedSignal, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { filter, map, Subject } from "rxjs";
import { NotificationService } from "./notification.service";
import { SocketService } from "./socket.service";
import {
    AddBotAction,
    EndTurnAction,
    JoinRoomAction,
    JoinRoomSuccessData,
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
    private readonly notificationService = inject(NotificationService);

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

    joined$ = new Subject<JoinRoomSuccessData>();
    reconnected$ = new Subject<JoinRoomSuccessData>();

    player = computed(() => {
        const playerId = this.socketService.clientId;
        const gameState = this.gameState();
        if (!playerId || !gameState) return undefined;
        return gameState.players[playerId];
    });
    enemy = computed(() => {
        const playerId = this.socketService.clientId;
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
            console.log("Current player:", currentPlayer);
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
                this.handleJoinRoom(event.data);
                this.joined$.next(event.data);
                break;
            case "reconnect_result":
                this.handleJoinRoom(event.data);
                this.reconnected$.next(event.data);
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
    }
}
