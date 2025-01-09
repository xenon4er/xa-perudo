import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { BoardContext } from "../contexts/board-context";
import { Game } from "../game/Game";
import { PlayerIcon } from "./player-icon";
import styles from "./host-panel.module.css";
import { TPlayer } from "../types/game.type";
import { useTranslation } from "react-i18next";

export function HostPanel({
    game,
    onClose,
}: {
    game?: Game;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const { players, status } = useContext(BoardContext);
    const [order, setOrder] = useState<TPlayer["id"][]>([]);

    useEffect(() => {
        setOrder((order) => {
            const _players = new Set(players.map((p) => p.id));
            const checkedOrder = order.filter((p) => _players.has(p));
            const notInOrder = players
                .filter((p) => !order.includes(p.id))
                .map((p) => p.id);
            return checkedOrder.concat(notInOrder);
        });
    }, [players]);

    function handleRestart(): void {
        game?.doRestart();
    }

    const handleStart = useCallback(() => {
        game?.doStart(order);
        onClose();
    }, [order, game, onClose]);

    const handleMoveToTop = (idx: number) => {
        if (idx < 1) {
            return;
        }
        setOrder((order) => {
            const newOrder = order.slice();
            const tmp = newOrder[idx];
            newOrder[idx] = newOrder[idx - 1];
            newOrder[idx - 1] = tmp;
            return newOrder;
        });
    };

    const handleMoveToBottom = (idx: number) => {
        setOrder((order) => {
            if (idx >= order.length - 1) {
                return order;
            }
            const newOrder = order.slice();
            const tmp = newOrder[idx];
            newOrder[idx] = newOrder[idx + 1];
            newOrder[idx + 1] = tmp;
            return newOrder;
        });
    };

    const getPlayersList = useCallback(() => {
        return order.map((id, idx) => {
            return (
                <Fragment key={id}>
                    <div className={styles.player}>
                        <div className={styles.name}>
                            <PlayerIcon idx={id}></PlayerIcon>
                        </div>
                    </div>
                    <div className={styles.order}>
                        {idx !== 0 && (
                            <button onClick={() => handleMoveToTop(idx)}>
                                ↑
                            </button>
                        )}
                        {idx !== order.length - 1 && (
                            <button onClick={() => handleMoveToBottom(idx)}>
                                ↓
                            </button>
                        )}
                    </div>
                </Fragment>
            );
        });
    }, [order]);

    return (
        <>
            <div className={styles.players}>{getPlayersList()}</div>
            <div className={styles.controls}>
                {status === "initial" && (
                    <button onClick={handleStart}>
                        {t("hostPanel.start")}
                    </button>
                )}
                <button onClick={handleRestart}>
                    {t("hostPanel.restart")}
                </button>
            </div>
        </>
    );
}
