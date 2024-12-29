import { ClientMessage } from "./client-message.type";

export type ServerMessageBase<T = unknown> = {
    type: "init" | "leave" | "error" | "proxy";
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
