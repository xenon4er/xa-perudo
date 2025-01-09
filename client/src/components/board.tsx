import { useContext } from "react";
import { PlayerList } from "./player-list";
import { Turn } from "./turn";
import { BoardContext } from "../contexts/board-context";
import { Game } from "../game/Game";
import { useTranslation } from "react-i18next";

import styles from "./board.module.css";

export function Board({
    game,
    handleIAmHost,
}: {
    game?: Game;
    handleIAmHost: () => void;
}) {
    const { host } = useContext(BoardContext);
    const { t } = useTranslation();

    return (
        <div className={styles.board}>
            <PlayerList></PlayerList>

            <div className={styles.actions}>
                {!host && (
                    <button onClick={() => handleIAmHost()}>
                        {t("board.iAmTheHost")}
                    </button>
                )}

                <Turn game={game}></Turn>
            </div>
        </div>
    );
}
