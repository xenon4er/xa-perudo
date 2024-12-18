import {useContext} from "react";
import {Player} from "./player";
import {Turn} from "./turn";
import {BoardContext} from "../contexts/board-context";

export function Board({
    positions,
    ws,
    handleIAmHost,
}: {
    positions: Record<string, [number, number]>;
    ws?: WebSocket;
    handleIAmHost: (host: string) => void;
}) {
    const board = useContext(BoardContext)
    return (
        <>
            {!board.host && (
                <button onClick={() => handleIAmHost(board.me!)}>
                    I AM THE HOST
                </button>
            )}

            <Turn
                key={Date.now()}
                ws={ws}
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