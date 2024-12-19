import { ClientMessage, ServerMessage } from "../models/message.model";
import {RequiredFields} from "../types/common.types";
import { Player, TPlayer } from "./Player";

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
    players: TPlayer[];
    status: GameStatus;
    me: TPlayer["id"] | null;
    host: TPlayer["id"] | null;
    turn: TPlayer["id"] | null;
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

    iAmHost(): void {
        this.onEvent({
            type: "iAmHost",
            data: this.me!,
        });
        this.addMessage({
            type: "proxy",
            data: {
                type: "iAmHost",
                data: this.me!,
            },
        })
    }

    doStart(order: TPlayer["id"][]): void {
        const message: ClientMessage = {
            type: "start",
            data: {
                order: order,
                turn: order[0],
            },
        };

        this.onEvent(message);
        this.addMessage({
            type: "proxy",
            data: message,
        });
    }

    doRestart(): void {
        const message: ClientMessage = {
            type: "restart",
        };
        this.onEvent(message);
        this.addMessage({
            type: "proxy",
            data: message,
        });
    }

    doRoll(): void {
        const message: ClientMessage = {
            type: "roll",
        };
        this.onEvent(message);
        this.addMessage({
            type: "proxy",
            data: message,
        });
    }

    doBet(bet: Bet): void {
        const message: ClientMessage = {
            type: "bet",
            data: bet,
        };
        this.onEvent(message);
        this.addMessage({
            type: "proxy",
            data: message,
        });
    }

    doCheck(): void {
        const message: ClientMessage = {
            type: "check",
        };
        this.onEvent(message);
        this.addMessage({
            type: "proxy",
            data: message,
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onStateUpdate(state: TGame): void {}


    onEvent(event: ClientMessage): void {}


    private join(input: RequiredFields<Partial<TPlayer>, "id">): Player {
        const player = new Player(input);
        this.players.push(player);
        return player;
    }

    private leave(id: string): void {
        this.players = this.players.filter((p) => p.id !== id);
        if (this.host === id) {
            this.setHost(null);
        }
        if (this.turn === id) {
            this.setTurn(null);
        }
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

    private setBet(bet: Bet | null): void {
        this.bet = bet;
    }

    private setStatus(status: GameStatus): void {
        this.status = status;
    }

    private getMe(isSecure = true): TPlayer {
        const me = this.players.find(p => p.id === this.me);
        return me!.getPlayer(isSecure);
    }

    private snapshot(): TGame {
        return {
            bet: this.bet,
            host: this.host,
            me: this.me,
            players: this.players.map(p => p.getPlayer(false)),
            status: this.status,
            turn: this.turn,
        }
    }

    private getNextPlayerId(
        id: Player["id"],
        players: Player[],
    ): TPlayer["id"] {
        const idx = players.findIndex(p => p.id === id);
        const nextIdx = (idx + 1) % players.length;
        const nextId = players[nextIdx].id;
        if (players[nextIdx].dices.length) {
            return nextId;
        }

        return this.getNextPlayerId(nextId, players);
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
                const player = this.join({
                    id: message.data,
                });
                this.setMe(message.data);
                this.onEvent({
                    type: "joinRequest",
                    data: player,
                })
                break;
            }
            case "leave": {
                this.leave(message.data);
                break;
            }
            case "proxy": {
                const clientMessage = message.data;
                console.log("proxy", clientMessage);
                switch (clientMessage.type) {
                    case "joinRequest": {
                        this.join(clientMessage.data)
                        this.onEvent({
                            type: "joinAccept",
                            to: clientMessage.data.id,
                            data: {
                                host: this.host,
                                bet: this.bet,
                                status: this.status,
                                turn: this.turn,
                                player: this.getMe(!["gameOver", "roundOver"].includes(this.status)),
                            },
                        })
                        break;
                    }
                    case "joinAccept": {
                        this.join(clientMessage.data.player);
                        if (clientMessage.data.player.id === clientMessage.data.host) {
                            this.setBet(clientMessage.data.bet);
                            this.setHost(clientMessage.data.host);
                            this.setStatus(clientMessage.data.status);
                            this.setTurn(clientMessage.data.turn);
                        }
                        break;
                    }
                    case "iAmHost": {
                        this.setHost(clientMessage.data);
                        break;
                    }
                    case "roll": {
                        const turnPlayer = this.players.find(p => p.id === this.turn);
                        turnPlayer?.removeDice();
                        this.players.forEach((p) => p.doRoll(this.me!));
                        let turn = null;
                        if (turnPlayer?.dices.length === 0) {
                            turn = this.getNextPlayerId(
                                this.turn!,
                                this.players,
                            );
                        }
                        if (turn) {
                            this.setTurn(turn);
                        }
                        this.setStatus("inProgress");
                        this.setBet(null);
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
                        const message: ClientMessage = {
                            type: "revealDices",
                            data: {
                                id: this.me!,
                                dices: this.getMe().dices,
                            },
                        };
                        this.onEvent(message);
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
                        this.setTurn(clientMessage.data.turn);
                        this.setStatus("ready");
                        this.changeOrder(clientMessage.data.order)
                        break;
                    }
                    case "restart": {
                        this.setBet(null);
                        this.setTurn(null);
                        this.setStatus("initial");
                        this.players.forEach(p => p.generateDices());
                    }
                }
                break;
            }
            case "error":
                break;
        }
    }
}
