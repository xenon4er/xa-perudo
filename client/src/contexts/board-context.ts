import { TGame } from "../types/game.type";
import { createContext } from "react";

export const BoardContext = createContext<TGame>({
    me: null,
    host: null,
    players: [],
    bet: null,
    turn: null,
    status: "initial",
});
