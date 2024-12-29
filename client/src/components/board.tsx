import { useContext, useEffect } from "react";
import { PlayerList } from "./player-list";
import { Turn } from "./turn";
import { BoardContext } from "../contexts/board-context";
import { Game } from "../game/Game";

import styles from "./board.module.css";

export function Board({
    game,
    handleIAmHost,
}: {
    game?: Game;
    handleIAmHost: () => void;
}) {
    const { host } = useContext(BoardContext);

    useEffect(() => {
        console.log("Board");
    }, []);

    return (
        <div className={styles.board}>
            <PlayerList></PlayerList>

            <div className={styles.actions}>
                {!host && (
                    <button onClick={() => handleIAmHost()}>
                        I AM THE HOST
                    </button>
                )}

                <Turn game={game}></Turn>
            </div>
        </div>
    );
}
