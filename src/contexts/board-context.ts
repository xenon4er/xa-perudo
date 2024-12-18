import { createContext } from "react";
import {TGame} from "../game/Game";

export const BoardContext = createContext<TGame>({
    me: null,
    host: null,
    players: [],
    bet: null,
    turn: null,
    status: "initial",
});
