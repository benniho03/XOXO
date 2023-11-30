import React, { useState } from 'react'
import { Button } from './ui/button'
import { ArrowPathIcon } from '@heroicons/react/24/solid'

export default function RestartButton({ socket, gameId }: { socket: WebSocket, gameId: string }) {
    const [disabled, setDisabled] = useState(false)

    function handleClick() {
        console.log("Handling Click")
        socket.send(JSON.stringify({
            type: "restart",
            gameId: gameId
        }))

        setDisabled(true)
    }

    return (
        <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick} disabled={disabled}>
            <ArrowPathIcon className="h-5 w-5 inline-block mr-2" />
            Restart
        </Button>
    )
}