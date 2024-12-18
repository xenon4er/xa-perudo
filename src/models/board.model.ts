import {Bet, GameStatus} from "../types/types";
import {Player} from "./player.model";

export type BoardState = {
    me: Player["id"] | null;
    host: Player["id"] | null;
    players: Record<Player["id"], Player>;
    playersOrder: string[];
    turn: Player["id"] | null;
    bet: Bet | null;
    status: GameStatus;
}

export function createBoard(): BoardState {
    return {
        me: null,
        host: null,
        players: {},
        playersOrder: [],
        bet: null,
        turn: null,
        status: "initial",
    }
}