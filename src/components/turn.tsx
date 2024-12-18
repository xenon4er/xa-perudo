import { useContext, useMemo, useState } from "react";
import { Bet } from "../types/types";
import { BoardContext } from "../contexts/board-context";
import { SliderSelector } from "./slider-selector";
import { Dice } from "./dice";

export function Turn({ ws }: { ws?: WebSocket }) {
    const board = useContext(BoardContext);
    const [bet, setBet] = useState<Bet>(() => {
        return {
            nominal: board.bet?.nominal ?? 1,
            count: board.bet?.count ?? 1,
        };
    });

    function handleRoll(): void {
        // if (board.turn) {
        //     let turnPlayerDicesCount =
        //         board.players[board.turn].dices.length;
        //     if (board.status === "roundOver") {
        //         turnPlayerDicesCount -= 1;
        //     }
        //     dispatch?.({
        //         type: "roll",
        //         payload: {
        //             turnPlayerDicesCount: turnPlayerDicesCount,
        //         },
        //     });
        // }
        // ws?.send(
        //     clientMessageToString({
        //         type: "roll",
        //     }),
        // );
    }

    function handleBet(bet: Bet): void {
        // dispatch?.({
        //     type: "bet",
        //     payload: bet,
        // });
        // ws?.send(
        //     clientMessageToString({
        //         type: "bet",
        //         data: bet,
        //     }),
        // );
    }

    function handleCheck(me: string, dices: number[]): void {
        // ws?.send(
        //     clientMessageToString({
        //         type: "check",
        //     }),
        // );
        // ws?.send(
        //     clientMessageToString({
        //         type: "revealDices",
        //         data: {
        //             id: me,
        //             dices: dices,
        //         },
        //     }),
        // );
    }

    const dicesCount = useMemo(
        () =>
            Object.values(board.players).reduce((res: number[], p) => {
                p.dices.forEach(() => {
                    const prev = res.at(-1);
                    res.push(prev ? prev + 1 : 1);
                });
                return res;
            }, []),
        [board],
    );

    const dicesNominal = useMemo(
        () =>
            Array(6)
                .fill(0)
                .map((_, idx) => idx + 1),
        [],
    );

    const isValid = useMemo(() => {
        if (!board.bet || board.turn !== board.me || board.status === "roundOver") {
            return true;
        }

        if (board.bet.nominal === 1) {
            if (bet.nominal === 1 && bet.count > board.bet.count) {
                return true;
            }

            if (bet.nominal !== 1 && bet.count > board.bet.count * 2) {
                return true;
            }
        } else {
            if (
                bet.nominal > board.bet.nominal &&
                bet.count === board.bet.count
            ) {
                return true;
            }

            if (bet.count > board.bet.count) {
                return true;
            }

            if (
                bet.nominal === 1 &&
                bet.count >= Math.ceil(board.bet.count / 2)
            ) {
                return true;
            }
        }

        return false;
    }, [bet, board]);

    return (
        <>
            {(board.turn === board.me && (board.status === "ready" ||
                board.status === "roundOver")) && (
                <button type="button" onClick={handleRoll}>
                    Roll
                </button>
            )}
            {(board.status === "inProgress" || board.status === "roundOver") && (
                <>
                    <div
                        style={{
                            marginBottom: "20px",
                        }}
                    >
                        <SliderSelector
                            readonly={board.turn !== board.me || board.status === "roundOver"}
                            selectedIdx={dicesCount.indexOf(bet.count)}
                            isInvalid={!isValid}
                            onChange={(index) =>
                                setBet((bet) => ({
                                    ...bet,
                                    count: dicesCount[index],
                                }))
                            }
                        >
                            {dicesCount.map((v) => (
                                <Dice side={v} key={v} type="number"></Dice>
                            ))}
                        </SliderSelector>
                    </div>

                    <SliderSelector
                        readonly={board.turn !== board.me || board.status === "roundOver"}
                        selectedIdx={dicesNominal.indexOf(bet.nominal)}
                        isInvalid={!isValid}
                        onChange={(index) =>
                            setBet((bet) => ({
                                ...bet,
                                nominal: dicesNominal[index],
                            }))
                        }
                    >
                        {dicesNominal.map((v) => (
                            <Dice side={v} key={v} type="dot"></Dice>
                        ))}
                    </SliderSelector>

                    {board.turn && board.turn === board.me && board.status !== "roundOver" && (
                        <>
                            <button
                                disabled={!isValid}
                                onClick={() => handleBet(bet)}
                            >
                                Bet
                            </button>
                            {board.bet && (
                                <button onClick={() => handleCheck(board.me!, board.players[board.me!].dices)}>Check</button>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}
