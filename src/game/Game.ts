import { ServerMessage } from "../models/message.model";
import { Player } from "./Player";

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

export interface TGame {
    players: Player[];
    status: GameStatus;
    me: Player["id"] | null;
    host: Player["id"] | null;
    turn: Player["id"] | null;
    bet: Bet | null;
}

// export type GameEvent = {
//     type: "",
//     payload:
// }

export class Game {
    private players: Player[];
    private status: GameStatus;
    private me: Player["id"] | null;
    private host: Player["id"] | null;
    private turn: Player["id"] | null;
    private bet: Bet | null;

    private timer: NodeJS.Timeout | null = null;
    private queue: ServerMessage[] = [];

    constructor() {
        this.players = [];
        this.status = "initial";
        this.me = null;
        this.host = null;
        this.turn = null;
        this.bet = null;
    }

    init(): void {
        if (!this.timer) {
            this.loop();
        }
    }

    destroy(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    addMessage(message: ServerMessage): void {
        this.queue.push(message);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onStateUpdate(state: TGame): void {}


    onEvent(event): void {}


    private join(id: string): Player {
        const player = new Player(id);
        this.players.push(player);
        return player;
    }

    private leave(id: string): void {
        this.players.filter((p) => p.id !== id);
    }

    private changeOrder(order: string[]): void {
        // performance might be improved using a hash table
        this.players.sort((a, b) => {
            return (
                order.findIndex((p) => p === a.id) -
                order.findIndex((p) => p === b.id)
            );
        });
    }

    private setMe(me: string): void {
        this.me = me;
    }

    private setHost(host: string | null): void {
        this.host = host;
    }

    private setTurn(turn: string | null): void {
        this.turn = turn;
    }

    private setBet(bet: Bet): void {
        this.bet = bet;
    }

    private doRoll(): void {
        this.players.forEach((p) => p.doRoll(this.me!));
    }

    private snapshot(): TGame {
        return {
            bet: this.bet,
            host: this.host,
            me: this.me,
            players: this.players,
            status: this.status,
            turn: this.turn,
        }
    }

    private loop() {
        const message = this.queue.shift();
        if (message) {
            //
            this.processMessage(message);
            this.onStateUpdate(this.snapshot());
        }
        this.timer = setTimeout(() => {
            this.loop();
        }, 50);
    }


    private processMessage(message: ServerMessage): void {
        switch (message.type) {
            case "init": {
                const player = this.join(message.data);
                this.setMe(message.data);
                this.onEvent({
                    type: "joinRequest",
                    data: player,
                })
                break;
            }
            case "leave": {
                this.players = this.players.filter(p => p.id !== message.data);
                if (this.host === message.data) {
                    this.setHost(null);
                }
                if (this.turn === message.data) {
                    this.setTurn(null);
                }
                break;
            }
            case "proxy": {
                const clientMessage = message.data;
                switch (clientMessage.type) {
                    case "joinRequest": {
                        // dispatch({
                        //     type: "joinRequest",
                        //     payload: clientMessage,
                        // });
                        // if (board.me) {
                        //     const me = { ...board.players[board.me] };
                        //     if (
                        //         ["gameOver", "roundOver"].includes(board.status)
                        //     ) {
                        //         me.dices = me.dices.map(() => 0);
                        //     }
                        //     ws.current?.send(
                        //         clientMessageToString({
                        //             type: "joinAccept",
                        //             to: clientMessage.data.id,
                        //             data: {
                        //                 host: board.host,
                        //                 bet: board.bet,
                        //                 status: board.status,
                        //                 turn: board.turn,
                        //                 player: me,
                        //             },
                        //         }),
                        //     );
                        // }
                        break;
                    }
                    case "joinAccept": {
                        // dispatch({
                        //     type: "joinAccept",
                        //     payload: clientMessage,
                        // });
                        break;
                    }
                    case "iAmHost": {
                        // dispatch({
                        //     type: "host",
                        //     payload: clientMessage.data,
                        // });
                        break;
                    }
                    case "roll": {
                        // if (board.turn) {
                            // let turnPlayerDicesCount =
                            //     board.players[board.turn].dices.length;
                            // if (board.status === "roundOver") {
                            //     turnPlayerDicesCount -= 1;
                            // }
                            // dispatch({
                            //     type: "roll",
                            //     payload: {
                            //         turnPlayerDicesCount: turnPlayerDicesCount,
                            //     },
                            // });
                        // }
                        break;
                    }
                    case "bet": {
                        // dispatch({
                        //     type: "bet",
                        //     payload: clientMessage.data,
                        // });
                        break;
                    }
                    case "check": {
                        // console.log("effect", board.me);
                        // ws.current?.send(
                        //     clientMessageToString({
                        //         type: "revealDices",
                        //         data: {
                        //             id: board.me!,
                        //             dices: board.players[board.me!].dices,
                        //         },
                        //     }),
                        // );
                        break;
                    }
                    case "revealDices": {
                        // dispatch({
                        //     type: "revealDices",
                        //     payload: clientMessage.data,
                        // });
                        break;
                    }
                    case "start": {
                        // dispatch({
                        //     type: "start",
                        //     payload: {
                        //         playersOrder: clientMessage.data.playersOrder,
                        //         turn: clientMessage.data.turn,
                        //     },
                        // });
                        break;
                    }
                    case "restart": {
                        // dispatch({
                        //     type: "restart",
                        // });
                    }
                }
                break;
            }
            case "error":
                break;
        }
    }
}
