import { useEffect, useRef, useState } from "react";
import "./App.css";
import { HostPanel } from "./components/host-panel";
import { Board } from "./components/board";
import { BoardContext } from "./contexts/board-context";
import {Game, TGame} from "./game/Game";

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

    const [isHostPanelVisible, setIsHostPanelVisible] = useState(false);
    const game = useRef<Game>();

    useEffect(() => {
        
        const g = new Game();

        g.onStateUpdate = (msg) => {
            console.log(msg);
            dispatch(msg);
        }

        g.onOpen = () => {
            setConnection(true);
        }

        g.onClose = () => {
            setConnection(false);
            console.log("Connection closed");
        };
        
        game.current = g;

        return () => {
            g.destroy();
        };
    }, []);

    function handleIAmHost(): void {
        setIsHostPanelVisible(true);
        game.current?.iAmHost();
    }

    return (<>
        <BoardContext.Provider value={board}>
        <div className="content">
            <Board
                game={game.current}
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
