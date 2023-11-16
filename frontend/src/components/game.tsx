import { GlutenFont } from '@/lib/utils';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import './game.css'
import LoadingSpinner from './loading-spinner';
import { TrophyIcon, ClipboardIcon } from '@heroicons/react/24/outline';


type Role = "X" | "O"

export default function Game({ socket, username, gameId }: { socket: WebSocket, username: string, gameId: string }) {
    const [board, setBoard] = useState(createBoard(3))
    const [players, setPlayers] = useState([{ name: "", role: "X" }, { name: "", role: "O" }]);
    const [activePlayer, setActivePlayer] = useState<Role>("X")
    const [role, setRole] = useState<Role>("X")
    const [winner, setWinner] = useState<string | null>(null)

    socket.addEventListener("message", (event) => {
        const serverMessage = JSON.parse(event.data) as Message;

        if (serverMessage.type === "move") {
            setBoard(serverMessage.board)
            setActivePlayer(serverMessage.activePlayer)
        }

        if (serverMessage.type === "join") {
            setPlayers(serverMessage.players)

            setRole(serverMessage.players.find((player) => player.name === username)?.role || "X")

            console.log(`${serverMessage.username} has joined the game!`)

            toast.success(`${serverMessage.username} has joined the game!`, {
                icon: '👋🏼',
                duration: 1500,
                className: 'border border-green-500'
            })
        }

        if (serverMessage.type === "win") {
            setWinner(serverMessage.username)
            toast.success(`${serverMessage.username} has won the game!`, {
                icon: '🏆',
                duration: 1500,
                className: 'border border-green-500'
            })
        }

        if (serverMessage.type === "error") {
            toast.error(serverMessage.errorMessage, {
                icon: '🚨',
                duration: 1500,
                className: 'border border-red-500'
            })
        }

    });


    function sendMoveToServer({ row, col, playerIdentity }: { row: number, col: number, playerIdentity: Role }) {
        socket.send(JSON.stringify({ type: "move", row, col, player: playerIdentity }))
    }

    if (!players[1].name) return (
        <>
            <LoadingSpinner />
        </>
    )

    if (winner) return (
        <div className="flex justify-center items-center flex-col">
            <div className="h-24 w-24 text-slate-900">
                <TrophyIcon />
            </div>
            <p>{winner} has won the game!</p>
        </div>
    )

    return (
        <div className='mx-auto'>
            <div className='flex justify-end items-center'>
                <p className='text-xl'>Game ID: {gameId}</p>
                <button onClick={() => navigator.clipboard.writeText(gameId)}><ClipboardIcon className='h-6 w-6 hover:cursor-pointer hover:text-slate-600' /></button>
            </div>
            <h2 className='text-center'><span>{players[0].name || "???"}</span> VS <span>{players[1].name || "???"}</span></h2>
            <p>You play: {role}</p>
            <p>{activePlayer === role ? "It's your turn!" : "Waiting for opponent..."}</p>
            <div className='flex flex-col items-center'>
                {board.map((row, rowIndex) => {
                    return <div className='flex row' key={rowIndex}>
                        {
                            row.map((squareValue: null | "X" | "O", colIndex: number) => {
                                return <button
                                    className={`${GlutenFont.className} cell border-slate-900 border-2 font-bold text-6xl w-32 h-32 hover:cursor-pointer hover:bg-slate-100 hover:disabled:cursor-not-allowed hover:disabled:bg-white`}
                                    key={colIndex}
                                    onClick={() => sendMoveToServer({ row: rowIndex, col: colIndex, playerIdentity: role })}
                                    disabled={squareValue !== null || activePlayer !== role}
                                >{squareValue ?? ""}</button>
                            })
                        }
                    </div>
                })}
            </div>
        </div>
    )
}

function createBoard(size: number) {
    return Array(size).fill(Array(size).fill(null))
}