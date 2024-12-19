import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import {
    clientMessageToString,
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

    const [center, setCenter] = useState([0, 0]);
    const [isHostPanelVisible, setIsHostPanelVisible] = useState(false);
    const ws = useRef<WebSocket>();
    const game = useRef<Game>();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3000");
        const g = new Game();

        g.onStateUpdate = (msg) => {
            console.log(msg);
            dispatch(msg);
        }

        g.onEvent = (event) => {
            if (socket.OPEN) {
                socket.send(clientMessageToString(event))
            }
        }

        socket.onopen = () => {
            setConnection(true);
            g.init();
        };
        socket.onclose = () => {
            setConnection(false);
            console.log("Connection closed");
        };
        socket.onmessage = (ev) => {
            const message = serverMessageToJSON(ev.data);
            g.addMessage(message);
        };


        game.current = g;
        ws.current = socket;

        return () => {
            g.destroy();
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

    function handleIAmHost(): void {
        setIsHostPanelVisible(true);
        game.current?.iAmHost();
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
                game={game.current}
                positions={positions}
                handleIAmHost={() => handleIAmHost()}
            ></Board>
        </div>

        <div className="info">
            {board.me && board.me === board.host && (
                <>
                    {isHostPanelVisible && (
                        <HostPanel
                            game={game.current}
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
