export type WebSocketSuccessEvent =
    | CreateRoomSuccessEvent
    | JoinRoomSuccessEvent
    | ReconnectSuccessEvent
    | AddBotSuccessEvent
    // game specific events
    | GameStateEvent;

export type WebSocketErrorEvent =
    | ErrorEvent
    | CreateRoomFailureEvent
    | JoinRoomFailureEvent
    | ReconnectFailureEvent
    | AddBotFailureEvent;
export type WebSocketMessage = WebSocketSuccessEvent | WebSocketErrorEvent;
export type WebSocketActions =
    | JoinRoomAction
    | ReconnectAction
    | RollDiceAction
    | SelectDiceAction
    | SetDiceAsideAction
    | AddBotAction
    | EndTurnAction;

/**
 * Success events
 */
export type CreateRoomSuccessData = {
    roomId: string;
};
export type CreateRoomSuccessEvent = {
    type: "create_room_result";
    success: true;
    data: CreateRoomSuccessData;
};

export type JoinRoomSuccessData = {
    clientId: string;
    roomId: string;
};
export type JoinRoomSuccessEvent = {
    type: "join_room_result";
    success: true;
    data: JoinRoomSuccessData;
};

export type ReconnectSuccessData = {
    clientId: string;
    roomId: string;
};
export type ReconnectSuccessEvent = {
    type: "reconnect_result";
    success: true;
    data: ReconnectSuccessData;
};

export type AddBotSuccessEvent = {
    type: "add_bot_result";
    success: true;
};

/**
 * game-specific success events
 */
export type GameStateEvent = {
    type: "game_state";
    data: GameState;
};

/**
 * Error events
 */
export type CreateRoomFailureEvent = {
    type: "create_room_result";
    success: false;
    error: string;
};

export type JoinRoomFailureEvent = {
    type: "join_room_result";
    success: false;
    error: string;
};

export type ReconnectFailureEvent = {
    type: "reconnect_result";
    success: false;
    error: string;
};

export type AddBotFailureEvent = {
    type: "add_bot_result";
    success: false;
    error: string;
};

export type ErrorEvent = {
    type: "error";
    success: false;
    error: string;
};

export type Player = {
    id: string;
    name: string;
    score: number;
    turnScore: number;
    roundScore: number;
};

export type GameState = {
    players: { [key: string]: Player };
    started: boolean;
    currentTurn: string; // player id
    winner: string;
    dice: number[];
    selectedDice: number[]; // indexes of the dice
    setAside: number[];
    targetScore: number;
    turnScore: number; // maybe move to player
    roundScore: number; // maybe move to player
};

export type JoinRoomAction = {
    type: "join_room";
    data: {
        playerName: string;
        roomId: string | undefined;
        gameType: "dicegame";
    };
};

export type ReconnectAction = {
    type: "reconnect";
    data: {
        roomId: string;
        clientId: string;
    };
};

export type RollDiceAction = {
    type: "roll";
};

export type SelectDiceAction = {
    type: "select";
    data: {
        diceIndex: number;
    };
};

export type SetDiceAsideAction = {
    type: "set_aside";
    data: {
        endTurn: boolean;
    };
};

export type EndTurnAction = {
    type: "end_turn";
};

export type AddBotAction = {
    type: "add_bot";
};
