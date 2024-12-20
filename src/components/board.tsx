import {useContext} from "react";
import {PlayerList} from "./player-list";
import {Turn} from "./turn";
import {BoardContext} from "../contexts/board-context";
import {Game} from "../game/Game";

import styles from "./board.module.css";

export function Board({
    game,
    handleIAmHost,
}: {
    game?: Game;
    handleIAmHost: () => void;
}) {
    const board = useContext(BoardContext)
    
    return (
        <div className={styles.board} >

            <PlayerList></PlayerList>

            <div className={styles.actions}>
                {!board.host && (
                    <button onClick={() => handleIAmHost()}>
                        I AM THE HOST
                    </button>
                )}

                <Turn
                    key={Date.now()}
                    game={game}
                ></Turn>
            </div>
        </div>
    );
}