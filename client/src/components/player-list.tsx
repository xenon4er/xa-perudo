import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BoardContext } from "../contexts/board-context";
import { PlayerIcon } from "./player-icon";
import clsx from "clsx";

import styles from "./player-list.module.css";
import { TPlayer } from "../types/game.type";

export function Player({
    player,
    position,
}: {
    player: TPlayer;
    position: [number, number];
}) {
    const { turn, host, me, status, bet } = useContext(BoardContext);

    return (
        <div
            className={clsx(styles.player, {
                [styles._active]: player.id === turn,
                [styles._host]: player.id === host,
                [styles._current]: player.id === me,
                [styles._looser]: status === "roundOver" && player.id === turn,
                [styles._inactive]: player.dices.length === 0,
            })}
            style={{
                left: position[0] + "px",
                top: position[1] + "px",
            }}
        >
            <div className={styles.name}>
                <PlayerIcon idx={player.id}></PlayerIcon>
            </div>
            <div className={styles.dices}>
                {player.dices.map((v, idx) => (
                    <span
                        key={`${idx}_${v}`}
                        className={clsx(styles.dice, {
                            [styles._active]:
                                bet?.nominal && (v === bet.nominal || v === 1),
                        })}
                    >
                        {v === 0 ? "*" : v}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function PlayerList() {
    const { players, me } = useContext(BoardContext);
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
        const n = players.length;
        if (!n) {
            return {};
        }

        const firstPlayerIdx = players.findIndex((p) => p.id === me);
        const res: Record<string, [number, number]> = {};
        for (let i = 0; i < n; i++) {
            const idx = (i + firstPlayerIdx) % n;
            const beta = Math.PI * ((i * 2) / n - 1.5);
            const alpha = Math.atan2(a * Math.sin(beta), b * Math.cos(beta));
            const x = center[0] + a * Math.cos(alpha);
            const y = center[1] + b * Math.sin(alpha);
            res[players[idx].id] = [x, y];
        }
        return res;
    }, [center, players, me]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.list} ref={containerRef}>
                {players.map((p) => {
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
