export type WebSocketSuccessEvent =
    | JoinedEvent
    | CreateRoomSuccessEvent
    | JoinRoomSuccessEvent
    | ReconnectSuccessEvent
    | GameStateEvent
    | TmpScoreEvent;

export type WebSocketErrorEvent = ErrorEvent | CreateRoomFailureEvent | JoinRoomFailureEvent | ReconnectFailureEvent;
export type WebSocketMessage = WebSocketSuccessEvent | WebSocketErrorEvent;

/**
 * Success events
 */

export type JoinedData = {
    roomId: string;
    clientId: string;
};

export type JoinedEvent = {
    type: "joined";
    success: true;
    data: JoinedData;
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
    gameType: string;
    clients: number; // amount of people for whatever reason
};

export type JoinRoomSuccessEvent = {
    type: "join_room_result";
    success: true;
    data: JoinRoomSuccessData;
};

export type GameStateEvent = {
    type: "game_state";
    data: GameState;
};

export type TmpScoreData = {
    score: number;
};

export type TmpScoreEvent = {
    type: "temp_score";
    success: true;
    data: TmpScoreData;
};

/**
 * Failure events
 */
export type CreateRoomFailureEvent = {
    type: "create_room_result";
    success: false;
    error: string;
};

export type ErrorEvent = {
    type: "error";
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

//*
//
export type Player = {
    id: string;
    score: number;
};

export type GameState = {
    players: { [key: string]: Player };
    currentTurn: string; // player id
    winner: string;
    dice: number[];
    setAside: number[];
    turnScore: number;
    roundScore: number;
};

export type WebSocketActions =
    | JoinRoomAction
    | ReconnectAction
    | RollAction
    | SelectAction
    | SetAsideAction
    | EndTurnAction;

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

export type RollAction = {
    type: "roll";
};

export type SelectAction = {
    type: "select";
    data: {
        diceIndex: number[];
    };
};

export type SetAsideAction = {
    type: "set_aside";
    data: {
        diceIndex: number[];
    };
};

export type EndTurnAction = {
    type: "end_turn";
};
