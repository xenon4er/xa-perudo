
import clsx from "clsx";
import "./player.css";
import {BoardContext} from "../contexts/board-context";
import {useContext} from "react";
import {TPlayer} from "../game/Player";

export function Player({
    player,
    position,
}: {
    player: TPlayer;
    position: [number, number],
}) {
    const board = useContext(BoardContext)

    return (
        <div
            className={clsx("player", {
                _active: player.id === board.turn,
                _host: player.id === board.host,
                _current: player.id === board.me,
                _looser: board.status === "roundOver" && player.id === board.turn,
                _inactive: player.dices.length === 0,
            })}
            style={{
                "left": position[0] + "px",
                "top": position[1] + "px",
            }}
        >
            <div className="player__name">{player.name || player.id}</div>
            <div className="player__dices">
                {player.dices.map((v) => (v === 0 ? "*" : v)).join(" ")}
            </div>
        </div>
    );
}
