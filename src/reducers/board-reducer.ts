import { BoardState } from "../models/board.model";
import {
    ClientMessageJoinAccept,
    ClientMessageJoinRequest,
} from "../models/message.model";
import {
    createPlayer,
    getDicesWithCount as getDicesWithNominal,
    Player,
    roll,
} from "../models/player.model";
import { Bet } from "../types/types";

type InitAction = {
    type: "init";
    payload: Player;
};

type LeaveAction = {
    type: "leave";
    payload: Player["id"];
};

type HostAction = {
    type: "host";
    payload: Player["id"];
};

type RollAction = {
    type: "roll";
    payload: {
        turnPlayerDicesCount: number;
    };
};

type JoinAcceptAction = {
    type: "joinAccept";
    payload: ClientMessageJoinAccept;
};

type JoinRequestAction = {
    type: "joinRequest";
    payload: ClientMessageJoinRequest;
};

type BetAction = {
    type: "bet";
    payload: Bet;
};

type CheckAction = {
    type: "check";
};

type RevealDicesAction = {
    type: "revealDices";
    payload: Pick<Player, "id" | "dices">;
};

type StartAction = {
    type: "start";
    payload: Pick<BoardState, "playersOrder" | "turn">;
};

type RestartAction = {
    type: "restart";
};

function getNextPlayerId(
    id: Player["id"],
    players: Record<string, Player>,
    playersOrder: Player["id"][],
) {
    const idx = playersOrder.indexOf(id);
    const nextIdx = (idx + 1) % playersOrder.length;
    const nextId = playersOrder[nextIdx];
    if (players[nextId].dices.length) {
        return nextId;
    }

    return getNextPlayerId(nextId, players, playersOrder);
}

function getPrevPlayerId(
    id: Player["id"],
    players: Record<string, Player>,
    playersOrder: Player["id"][],
) {
    const idx = playersOrder.indexOf(id);
    const prevIdx = (playersOrder.length + idx - 1) % playersOrder.length;
    const prevId = playersOrder[prevIdx];
    if (players[prevId].dices.length) {
        return prevId;
    }

    return getPrevPlayerId(prevId, players, playersOrder);
}

export type Action =
    | InitAction
    | LeaveAction
    | HostAction
    | RollAction
    | JoinAcceptAction
    | JoinRequestAction
    | BetAction
    | CheckAction
    | RevealDicesAction
    | StartAction
    | RestartAction;

export function boardStateReducer(
    board: BoardState,
    action: Action,
): BoardState {
    switch (action.type) {
        case "init": {
            const player = action.payload;
            return {
                ...board,
                me: player.id,
                players: {
                    ...board.players,
                    [player.id]: player,
                },
                playersOrder: [player.id],
            };
        }
        case "leave": {
            const players = { ...board.players };
            delete players[action.payload];
            return {
                ...board,
                host: board.host === action.payload ? null : board.host,
                turn: board.turn === action.payload ? null : board.turn,
                players: players,
                playersOrder: board.playersOrder.filter(
                    (v) => v !== action.payload,
                ),
            };
        }
        case "host": {
            return {
                ...board,
                host: action.payload,
            };
        }
        case "roll": {
            if (!board.turn) {
                return board;
            }

            const players = {
                ...board.players,
            };

            players[board.turn].dices = new Array(
                action.payload.turnPlayerDicesCount,
            ).fill(0);

            for (const p in players) {
                if (p === board.me) {
                    players[p].dices = roll(players[p].dices.length);
                } else {
                    players[p].dices = players[p].dices.map(() => 0);
                }
            }

            let turn = null;
            if (players[board.turn].dices.length === 0) {
                turn = getNextPlayerId(
                    board.turn,
                    board.players,
                    board.playersOrder,
                );
            }

            return {
                ...board,
                status: "inProgress",
                bet: null,
                players: players,
                turn: turn ?? board.turn,
                // bet: message.data.bet,
                // status: message.data.status,
                // turn: message.data.turn,
            }
        }
        case "joinAccept": {
            const clientMessage = action.payload;
            const newBoard = {
                ...board,
                players: {
                    ...board.players,
                    [clientMessage.data.player.id]: clientMessage.data.player,
                },
            };
            if (clientMessage.data.player.id === clientMessage.data.host) {
                newBoard.bet = clientMessage.data.bet;
                newBoard.host = clientMessage.data.host;
                newBoard.status = clientMessage.data.status;
                newBoard.turn = clientMessage.data.turn;
            }
            return newBoard;
        }
        case "joinRequest": {
            const clientMessage = action.payload;
            const newBoard = {
                ...board,
                players: {
                    ...board.players,
                    [clientMessage.data.id]: clientMessage.data,
                },
            };
            return newBoard;
        }
        case "bet": {
            const nextTurn = getNextPlayerId(
                board.turn!,
                board.players,
                board.playersOrder,
            );
            return {
                ...board,
                bet: action.payload,
                turn: nextTurn,
            };
        }
        case "check": {
            return board;
        }
        case "revealDices": {
            const state = {
                ...board,
                players: {
                    ...board.players,
                    [action.payload.id]: {
                        ...board.players[action.payload.id],
                        dices: action.payload.dices,
                    },
                },
            };
            console.log("revealDices", "turn", board.turn);
            // check if all players revealed their values
            if (
                state.playersOrder.every(
                    (p) => !state.players[p].dices.some((d) => d === 0),
                )
            ) {
                const bet = state.bet;
                if (!bet) {
                    return state;
                }

                const isLier =
                    bet.count >
                    state.playersOrder.reduce(
                        (res, p) =>
                            res +
                            getDicesWithNominal(
                                state.players[p].dices,
                                bet.nominal,
                            ),
                        0,
                    );

                let turn = null;
                if (isLier) {
                    turn = getPrevPlayerId(state.turn!, state.players, state.playersOrder);
                }

                state.status = "roundOver";
                state.turn = turn ?? state.turn;
            }

            return state;
        }
        case "start": {
            return {
                ...board,
                status: "ready",
                playersOrder: action.payload.playersOrder,
                turn: action.payload.turn,
            };
        }
        case "restart":
            return {
                ...board,
                status: "initial",
                bet: null,
                playersOrder: board.me ? [board.me] : [],
                turn: null,
                players: Object.keys(board.players).reduce(
                    (result: Record<string, Player>, p) => {
                        result[p] = createPlayer({
                            id: p,
                            name: board.players[p].name,
                        });
                        return result;
                    },
                    {},
                ),
            };
    }
}
