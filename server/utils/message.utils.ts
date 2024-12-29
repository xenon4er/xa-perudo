import { ServerMessage } from "../types/server-message.type";
import { ClientMessage } from "../types/client-message.type";

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
