import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BoardContext } from "../contexts/board-context";
import { PlayerIcon } from "./player-icon";
import { TPlayer } from "../game/Player";
import clsx from "clsx";

import styles from "./player-list.module.css";

export function Player({
    player,
    position,
}: {
    player: TPlayer;
    position: [number, number];
}) {
    const board = useContext(BoardContext);

    return (
        <div
            className={clsx(styles.player, {
                [styles._active]: player.id === board.turn,
                [styles._host]: player.id === board.host,
                [styles._current]: player.id === board.me,
                [styles._looser]:
                    board.status === "roundOver" && player.id === board.turn,
                [styles._inactive]: player.dices.length === 0,
            })}
            style={{
                left: position[0] + "px",
                top: position[1] + "px",
            }}
        >
            <div className={styles.name}>
                <PlayerIcon idx={player.id}></PlayerIcon>
                {/* {player.name || player.id} */}
            </div>
            <div className={styles.dices}>
                {player.dices.map((v) => (v === 0 ? "*" : v)).join(" ")}
            </div>
        </div>
    );
}

export function PlayerList() {
    const board = useContext(BoardContext);
    const [center, setCenter] = useState([0, 0]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            const containerRect = containerRef.current?.getBoundingClientRect();
            if (containerRect) {
                setCenter([
                    Math.floor(containerRect.width / 2),
                    Math.floor(containerRect.height / 2),
                ]);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const positions = useMemo(() => {
        const [a, b] = center;
        const n = board.players.length;
        if (!n) {
            return {};
        }

        const firstPlayerIdx = board.players.findIndex(
            (p) => p.id === board.me,
        );
        const res: Record<string, [number, number]> = {};
        for (let i = 0; i < n; i++) {
            const idx = (i + firstPlayerIdx) % n;
            const beta = Math.PI * ((i * 2) / n - 1.5);
            const alpha = Math.atan2(a * Math.sin(beta), b * Math.cos(beta));
            const x = center[0] + a * Math.cos(alpha);
            const y = center[1] + b * Math.sin(alpha);
            res[board.players[idx].id] = [x, y];
        }
        return res;
    }, [center, board]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.list} ref={containerRef}>
                {board.players.map((p) => {
                    return (
                        <Player
                            key={p.id}
                            player={p}
                            position={positions[p.id]}
                        ></Player>
                    );
                })}
            </div>
        </div>
    );
}
