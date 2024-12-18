import {Bet} from "../types/types";
import {BoardState} from "./board.model";
import {Player} from "./player.model";

export type ClientMessageBase<T = unknown> = {
    type: "joinRequest" | "joinAccept" | "iAmHost" | "roll" | "restart" | "bet" | "check" | "revealDices" | "start";
    to?: string;
    data: T;
};

export type ClientMessageJoinRequest = {
    type: "joinRequest";
} & ClientMessageBase<Player>;

export type ClientMessageJoinAccept = {
    type: "joinAccept";
} & ClientMessageBase<{
    player: Player;
} & Pick<BoardState, "bet" | "turn" | "status" | "host">>;

export type ClientMessageIAmHost = {
    type: "iAmHost";
} & ClientMessageBase<string>;

export type ClientMessageRoll = {
    type: "roll";
} & Omit<ClientMessageBase, "data">;

export type ClientMessageRestart = {
    type: "restart";
} & Omit<ClientMessageBase, "data">;

export type ClientMessageBet = {
    type: "bet";
} & ClientMessageBase<Bet>;

export type ClientMessageCheck = {
    type: "check";
} & Omit<ClientMessageBase, "data">;

export type ClientMessageRevealDices = {
    type: "revealDices";
} & ClientMessageBase<Pick<Player, "id" | "dices">>;

export type ClientMessageStart = {
    type: "start";
} & ClientMessageBase<Pick<BoardState, "playersOrder" | "turn">>;

export type ClientMessage =
    ClientMessageJoinRequest
    | ClientMessageJoinAccept
    | ClientMessageIAmHost
    | ClientMessageRoll
    | ClientMessageRestart
    | ClientMessageBet
    | ClientMessageCheck
    | ClientMessageRevealDices
    | ClientMessageStart;

export function clientMessageToJSON(message: string): ClientMessage {
    try {
        return JSON.parse(message);
    } catch (e) {
        throw new Error(`Unable to parse client message. ${e}`);
    }
}

export function clientMessageToString(message: ClientMessage): string {
    return JSON.stringify(message);
}

export type ServerMessageBase<T = unknown> = {
    type:
        | "init"
        | "leave"
        | "error"
        | "proxy";
    data: T;
};

export type ServerMessageInit = {
    type: "init";
} & ServerMessageBase<string>;

export type ServerMessageLeave = {
    type: "leave";
} & ServerMessageBase<string>;

export type ServerMessageError = {
    type: "error";
} & ServerMessageBase<{
    status: number;
    message: string;
}>;

export type ServerMessageProxy = {
    type: "proxy";
} & ServerMessageBase<ClientMessage>;

export type ServerMessage =
    | ServerMessageError
    | ServerMessageInit
    | ServerMessageLeave
    | ServerMessageProxy;

export function serverMessageToString(message: ServerMessage): string {
    return JSON.stringify(message);
}

export function serverMessageToJSON(message: string): ServerMessage {
    try {
        return JSON.parse(message);
    } catch (e) {
        throw new Error(`Unable to parse server message. ${e}`);
    }
}
