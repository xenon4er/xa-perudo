import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import {
    clientMessageToString,
    ServerMessage,
    serverMessageToJSON,
} from "./models/message.model";
import { HostPanel } from "./components/host-panel";
import { Board } from "./components/board";
import { BoardContext } from "./contexts/board-context";
import {Game, TGame} from "./game/Game";

const margin = 250;

function App() {
    const [connection, setConnection] = useState(true);
    const [board, dispatch] = useState<TGame>(() => ({
        players: [],
        status: "initial",
        me:  null,
        host: null,
        turn: null,
        bet: null,
    }));
    //     boardStateReducer,
    //     undefined,
    //     createBoard,
    // );

    const [serverMessage, setServerMessage] = useState<ServerMessage>();

    const [center, setCenter] = useState([0, 0]);
    const [isHostPanelVisible, setIsHostPanelVisible] = useState(false);
    const ws = useRef<WebSocket>();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!serverMessage) {
            return;
        }

        const message = serverMessage;
        switch (message.type) {
            case "init": {
                // const player = createPlayer({ id: message.data });
                // dispatch({
                //     type: "init",
                //     payload: player,
                // });
                // ws.current?.send(
                //     clientMessageToString({
                //         type: "joinRequest",
                //         data: player,
                //     }),
                // );
                break;
            }
            case "leave": {
                // dispatch({
                //     type: "leave",
                //     payload: message.data,
                // });
                break;
            }
            case "error": {
                console.error(message.data);
                break;
            }
            case "proxy": {
                const clientMessage = message.data;
                switch (clientMessage.type) {
                    case "joinRequest": {
                        // dispatch({
                        //     type: "joinRequest",
                        //     payload: clientMessage,
                        // });
                        // if (board.me) {
                        //     const me = { ...board.players[board.me] };
                        //     if (
                        //         ["gameOver", "roundOver"].includes(board.status)
                        //     ) {
                        //         me.dices = me.dices.map(() => 0);
                        //     }
                        //     ws.current?.send(
                        //         clientMessageToString({
                        //             type: "joinAccept",
                        //             to: clientMessage.data.id,
                        //             data: {
                        //                 host: board.host,
                        //                 bet: board.bet,
                        //                 status: board.status,
                        //                 turn: board.turn,
                        //                 player: me,
                        //             },
                        //         }),
                        //     );
                        // }
                        break;
                    }
                    case "joinAccept": {
                        // dispatch({
                        //     type: "joinAccept",
                        //     payload: clientMessage,
                        // });
                        break;
                    }
                    case "iAmHost": {
                        // dispatch({
                        //     type: "host",
                        //     payload: clientMessage.data,
                        // });
                        break;
                    }
                    case "roll": {
                        // if (board.turn) {
                            // let turnPlayerDicesCount =
                            //     board.players[board.turn].dices.length;
                            // if (board.status === "roundOver") {
                            //     turnPlayerDicesCount -= 1;
                            // }
                            // dispatch({
                            //     type: "roll",
                            //     payload: {
                            //         turnPlayerDicesCount: turnPlayerDicesCount,
                            //     },
                            // });
                        // }
                        break;
                    }
                    case "bet": {
                        // dispatch({
                        //     type: "bet",
                        //     payload: clientMessage.data,
                        // });
                        break;
                    }
                    case "check": {
                        // console.log("effect", board.me);
                        // ws.current?.send(
                        //     clientMessageToString({
                        //         type: "revealDices",
                        //         data: {
                        //             id: board.me!,
                        //             dices: board.players[board.me!].dices,
                        //         },
                        //     }),
                        // );
                        break;
                    }
                    case "revealDices": {
                        // dispatch({
                        //     type: "revealDices",
                        //     payload: clientMessage.data,
                        // });
                        break;
                    }
                    case "start": {
                        // dispatch({
                        //     type: "start",
                        //     payload: {
                        //         playersOrder: clientMessage.data.playersOrder,
                        //         turn: clientMessage.data.turn,
                        //     },
                        // });
                        break;
                    }
                    case "restart": {
                        // dispatch({
                        //     type: "restart",
                        // });
                    }
                }
                break;
            }
        }
    }, [serverMessage]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3000");
        const game = new Game();

        game.onStateUpdate = (msg) => {
            console.log(msg);
            dispatch(msg);
        }

        game.onEvent = (event) => {
            if (socket.OPEN) {
                socket.send(clientMessageToString(event))
            }
        }

        socket.onopen = () => {
            setConnection(true);
            game.init();
        };
        socket.onclose = () => {
            setConnection(false);
            console.log("Connection closed");
        };
        socket.onmessage = (ev) => {
            const message = serverMessageToJSON(ev.data);
            setServerMessage(message);
            game.addMessage(message);
        };



        ws.current = socket;

        return () => {
            game.destroy();
            socket.close();
        };
    }, []);

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

    function handleIAmHost(host: string): void {
        setIsHostPanelVisible(true);
        // dispatch({
        //     type: "host",
        //     payload: host,
        // });
        ws.current?.send(
            clientMessageToString({
                type: "iAmHost",
                data: host,
            }),
        );
    }

    const positions = useMemo(() => {
        const a = center[0] - margin / 2;
        const b = center[1] - margin / 2;
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

    return (<>
        <BoardContext.Provider value={board}>
        <div className="content" ref={containerRef}>
            <Board
                ws={ws.current}
                positions={positions}
                handleIAmHost={(host) => handleIAmHost(host)}
            ></Board>
        </div>

        <div className="info">
            {board.me && board.me === board.host && (
                <>
                    {isHostPanelVisible && (
                        <HostPanel
                            ws={ws.current}
                            onClose={() => setIsHostPanelVisible(false)}
                        ></HostPanel>
                    )}
                    <button onClick={() => setIsHostPanelVisible(true)}>
                        Host Panel
                    </button>
                </>
            )}
            {import.meta.env.DEV && (
                <button
                    onClick={() => {
                        console.log(board);
                        console.log(board.players);
                    }}
                >
                    Log state
                </button>
            )}
        </div>
        {!connection && <div>Lost connection, reload the page</div>}
        </BoardContext.Provider>
        </>);
}

export default App;
