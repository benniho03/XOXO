import { GlutenFont } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import './game.css'
import LoadingSpinner from './loading-spinner';
import { TrophyIcon, ClipboardIcon, BoltIcon, ScaleIcon } from '@heroicons/react/24/outline';
import RestartButton from './restart-button';

type Role = "X" | "O"

export default function Game({ socket, username, gameId, playerId }: { socket: WebSocket, username: string, gameId: string, playerId: string }) {
    const [board, setBoard] = useState(createBoard(3))
    const [players, setPlayers] = useState<Player[]>([{ name: "", role: "X", playerId: "" }, { name: "", role: "O", playerId: "" }]);
    const [activePlayer, setActivePlayer] = useState<Role>("X")
    const [role, setRole] = useState<Role>("X")
    const [winner, setWinner] = useState<string | null>(null)
    const [draw, setDraw] = useState(false)

    useEffect(() => {
        socket.removeEventListener("message", handleMessage);
        socket.addEventListener("message", handleMessage);
    }, [])


    function handleMessage(event: MessageEvent<any>) {
        const serverMessage = JSON.parse(event.data) as Message;

        if (serverMessage.type === "move") {
            setBoard(serverMessage.board);
            setActivePlayer(serverMessage.activePlayer);
        }

        if (serverMessage.type === "join") {
            setPlayers(serverMessage.players);

            setRole(serverMessage.players.find((player) => player.playerId === playerId)?.role || "X");

            console.log(`${serverMessage.username} has joined the game!`);

            toast.success(`${serverMessage.username} has joined the game!`, {
                icon: '👋🏼',
                duration: 1500,
                className: 'border border-green-500'
            });
        }

        if (serverMessage.type === "win") {
            setWinner(serverMessage.username);
            toast.success(`${serverMessage.username} has won the game!`, {
                icon: '🏆',
                duration: 1500,
                className: 'border border-green-500'
            });
        }

        if (serverMessage.type === "error") {
            toast.error(serverMessage.errorMessage, {
                icon: '🚨',
                duration: 1500,
                className: 'border border-red-500'
            });
        }

        if (serverMessage.type === "draw") {
            toast("Draw!", {
                icon: '🤝',
                duration: 1500,
                className: 'border border-amber-500'

            });
            setDraw(true);
        }

        if (serverMessage.type === "restart") {
            console.log("Restarting game")
            setPlayers(serverMessage.players);
            setBoard(serverMessage.board);
            setWinner(null);
            setDraw(false);
            setActivePlayer("X");
        }
    }

    function sendMoveToServer({ row, col, playerIdentity }: { row: number, col: number, playerIdentity: Role }) {
        socket.send(JSON.stringify({ type: "move", row, col, player: playerIdentity }))
    }

    if (!players[1].name) return (
        <>
            <div className='mb-5'>
                <LoadingSpinner />
            </div>
            <div className='flex flex-col items-center'>
                <button onClick={() => navigator.clipboard.writeText(gameId)}><ClipboardIcon className='h-6 w-6 hover:cursor-pointer hover:text-slate-600' /></button>
                <p className='text-xl'>Game ID: {gameId}</p>
            </div>
        </>
    )

    if (winner) return (
        <div className="flex justify-center items-center flex-col">
            <div className="h-24 w-24 text-slate-900">
                <TrophyIcon />
            </div>
            <p>{winner} has won the game!</p>
            <RestartButton socket={socket} gameId={gameId} />
        </div>
    )

    if (draw) return (
        <div className="flex justify-center items-center flex-col">
            <div className="h-24 w-24 text-slate-900">
                <ScaleIcon />
            </div>
            <p>Game has resulted in a draw!</p>
            <RestartButton socket={socket} gameId={gameId} />
        </div>
    )

    return (
        <div className='mx-auto'>
            <div className='flex justify-center items-center relative mb-5'>
                <div>
                    <div className='flex text-center text-2xl justify-center gap-4 items-center'>
                        <p>{players[0].name || "???"}</p>
                        <BoltIcon className='h-6 w-6 mb-1' />
                        <p>{players[1].name || "???"}</p>
                    </div>
                    <div>
                        <p className='text-center'>{activePlayer === role ? "It's your turn!" : "Waiting for opponent..."}</p>
                    </div>
                </div>
                <div className='absolute right-0 flex flex-col items-center'>
                    <button onClick={() => navigator.clipboard.writeText(gameId)}><ClipboardIcon className='h-6 w-6 hover:cursor-pointer hover:text-slate-600' /></button>
                    <p className='text-xl'>Game ID: {gameId}</p>
                </div>
            </div>
            <div className='flex flex-col items-center'>
                {board.map((row, rowIndex) => {
                    return <div className='flex row' key={rowIndex}>
                        {
                            row.map((squareValue: null | "X" | "O", colIndex: number) => {
                                return <button
                                    className={`${GlutenFont.className} cell border-slate-900 border-2 font-bold text-6xl w-32 h-32 hover:cursor-pointer hover:bg-slate-100  hover:disabled:cursor-not-allowed hover:disabled:bg-white`}
                                    key={colIndex}
                                    onClick={() => sendMoveToServer({ row: rowIndex, col: colIndex, playerIdentity: role })}
                                    disabled={squareValue !== null || activePlayer !== role}
                                >{squareValue ?? ""}</button>
                            })
                        }
                    </div>
                })}
            </div>
        </div >
    )
}

function createBoard(size: number) {
    return Array(size).fill(Array(size).fill(null))
}