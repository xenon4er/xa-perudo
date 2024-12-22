import {
    Fragment,
    MouseEvent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { BoardContext } from "../contexts/board-context";
import { Game } from "../game/Game";
import { PlayerIcon } from "./player-icon";
import { TPlayer } from "../game/Player";
import styles from "./host-panel.module.css";

export function HostPanel({
    game,
    onClose,
}: {
    game?: Game;
    onClose: (event: MouseEvent<HTMLElement> | null) => void;
}) {
    const board = useContext(BoardContext);
    const [order, setOrder] = useState<TPlayer["id"][]>([]);

    useEffect(() => {
        setOrder((order) => {
            const players = new Set(board.players.map((p) => p.id));
            const checkedOrder = order.filter((p) => players.has(p));
            const notInOrder = board.players
                .filter((p) => !order.includes(p.id))
                .map((p) => p.id);
            return checkedOrder.concat(notInOrder);
        });
    }, [board]);

    function handleRestart(): void {
        game?.doRestart();
    }

    const handleStart = useCallback(() => {
        game?.doStart(order);
        onClose(null);
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
        <div className={styles.wrapper} onClick={(e) => onClose(e)}>
            <div
                className={styles.panel}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={styles.players}>{getPlayersList()}</div>
                <div className={styles.controls}>
                    {board?.status === "initial" && (
                        <button onClick={handleStart}>Start</button>
                    )}
                    <button onClick={handleRestart}>Restart</button>
                </div>
            </div>
        </div>
    );
}
