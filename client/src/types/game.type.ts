export type Bet = {
    nominal: number;
    count: number;
};

export type GameStatus =
    | "initial"
    | "ready"
    | "inProgress"
    | "roundOver"
    | "gameOver";

export type TPlayer = {
    id: string;
    name: string;
    dices: number[];
};

export interface TGame {
    players: TPlayer[];
    status: GameStatus;
    me: TPlayer["id"] | null;
    host: TPlayer["id"] | null;
    turn: TPlayer["id"] | null;
    bet: Bet | null;
}
