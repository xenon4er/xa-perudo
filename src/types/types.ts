export type Bet = {
    nominal: number;
    count: number;
};

export type GameStatus = "initial" | "ready" | "inProgress" | "roundOver" | "gameOver";
