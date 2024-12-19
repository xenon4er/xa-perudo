import {useContext} from "react";
import {Player} from "./player";
import {Turn} from "./turn";
import {BoardContext} from "../contexts/board-context";
import {Game} from "../game/Game";

export function Board({
    positions,
    game,
    handleIAmHost,
}: {
    positions: Record<string, [number, number]>;
    game?: Game;
    handleIAmHost: () => void;
}) {
    const board = useContext(BoardContext)
    return (
        <>
            {!board.host && (
                <button onClick={() => handleIAmHost()}>
                    I AM THE HOST
                </button>
            )}

            <Turn
                key={Date.now()}
                game={game}
            ></Turn>
            {board.players.map((p) => {
                return (
                    <Player
                        key={p.id}
                        player={p}
                        position={positions[p.id]}
                    ></Player>
                );
            })}
        </>
    );
}