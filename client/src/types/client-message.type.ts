import { Bet, TGame, TPlayer } from "./game.type";

export type ClientMessageBase<T = unknown> = {
    type:
        | "joinRequest"
        | "joinAccept"
        | "iAmHost"
        | "roll"
        | "restart"
        | "bet"
        | "check"
        | "revealDices"
        | "start";
    to?: string;
    data: T;
};

export type ClientMessageJoinRequest = {
    type: "joinRequest";
} & ClientMessageBase<TPlayer>;

export type ClientMessageJoinAccept = {
    type: "joinAccept";
} & ClientMessageBase<
    {
        player: TPlayer;
    } & Pick<TGame, "bet" | "turn" | "status" | "host">
>;

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
} & ClientMessageBase<Pick<TPlayer, "id" | "dices">>;

export type ClientMessageStart = {
    type: "start";
} & ClientMessageBase<
    Pick<TGame, "turn"> & {
        order: TPlayer["id"][];
    }
>;

export type ClientMessage =
    | ClientMessageJoinRequest
    | ClientMessageJoinAccept
    | ClientMessageIAmHost
    | ClientMessageRoll
    | ClientMessageRestart
    | ClientMessageBet
    | ClientMessageCheck
    | ClientMessageRevealDices
    | ClientMessageStart;
