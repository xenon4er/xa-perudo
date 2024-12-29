import { useContext, useEffect, useMemo, useState } from "react";
import { BoardContext } from "../contexts/board-context";
import { SliderSelector } from "./slider-selector";
import { Dice } from "./dice";
import { Game } from "../game/Game";
import { Bet } from "../types/game.type";

export function Turn({ game }: { game?: Game }) {
    const { bet, players, turn, me, status } = useContext(BoardContext);
    const [currentBet, setBet] = useState<Bet>({
        nominal: 1,
        count: 1,
    });

    useEffect(() => {
        setBet({
            nominal: bet?.nominal ?? 1,
            count: bet?.count ?? 1,
        });
    }, [bet]);

    function handleRoll(): void {
        game?.doRoll();
    }

    function handleBet(bet: Bet): void {
        game?.doBet(bet);
    }

    function handleCheck(): void {
        game?.doCheck();
    }

    const dicesCount = useMemo(
        () =>
            Object.values(players).reduce((res: number[], p) => {
                p.dices.forEach(() => {
                    const prev = res.at(-1);
                    res.push(prev ? prev + 1 : 1);
                });
                return res;
            }, []),
        [players],
    );

    const dicesNominal = useMemo(
        () =>
            Array(6)
                .fill(0)
                .map((_, idx) => idx + 1),
        [],
    );

    const isValid = useMemo(() => {
        if (!bet || turn !== me || status === "roundOver") {
            return true;
        }

        if (bet.nominal === 1) {
            if (currentBet.nominal === 1 && currentBet.count > bet.count) {
                return true;
            }

            if (currentBet.nominal !== 1 && currentBet.count > bet.count * 2) {
                return true;
            }
        } else {
            if (
                currentBet.nominal > bet.nominal &&
                currentBet.count === bet.count
            ) {
                return true;
            }

            if (currentBet.count > bet.count) {
                return true;
            }

            if (
                currentBet.nominal === 1 &&
                currentBet.count >= Math.ceil(bet.count / 2)
            ) {
                return true;
            }
        }

        return false;
    }, [currentBet, bet, me, status, turn]);

    return (
        <>
            {turn === me && (status === "ready" || status === "roundOver") && (
                <button type="button" onClick={handleRoll}>
                    Roll
                </button>
            )}
            {(status === "inProgress" || status === "roundOver") && (
                <>
                    <SliderSelector
                        readonly={turn !== me || status === "roundOver"}
                        selectedIdx={dicesCount.indexOf(currentBet.count)}
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

                    <SliderSelector
                        readonly={turn !== me || status === "roundOver"}
                        selectedIdx={dicesNominal.indexOf(currentBet.nominal)}
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

                    {turn && turn === me && status !== "roundOver" && (
                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                            }}
                        >
                            <button
                                disabled={!isValid}
                                onClick={() => handleBet(currentBet)}
                            >
                                Bet
                            </button>
                            {bet && (
                                <button onClick={() => handleCheck()}>
                                    Check
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
}
