"use client";
import Game from "@/components/game";
import UsernameComponent from "@/components/username";
import { useState } from "react";

export default function Home() {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [username, setUsername] = useState("");
	const [gameId, setGameId] = useState("");
	const [playerId, setPlayerId] = useState("");

	if (!socket || !username) {
		return (
			<UsernameComponent
				setSocket={setSocket}
				setUsername={setUsername}
				setGameId={setGameId}
				setPlayerId={setPlayerId}
			/>
		);
	}

	if(socket.readyState === WebSocket.CONNECTING) return <div>Connecting...</div>

	socket.addEventListener("close", (event) => {
		setSocket(null);
		setUsername("");
	});

	return (
		<div className="container py-3 ">
			<Game gameId={gameId} socket={socket} username={username} playerId={playerId} />
		</div>
	);

}
