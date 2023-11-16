import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { getSocket } from "@/lib/utils";
import toast from "react-hot-toast";
import LoadingSpinner from "./loading-spinner";

export default function UsernameComponent({
	setSocket,
	setUsername,
	setGameId
}: {
	setSocket: (socket: WebSocket) => void;
	setUsername: (username: string) => void;
	setGameId: (gameId: string) => void;
}) {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		login({
			setSocket,
			username: e.currentTarget.username.value,
			gameId: e.currentTarget.gameId.value,
		});
	}

	function login(
		{ setSocket, username, gameId }: { setSocket: (socket: WebSocket) => void; username: string; gameId: string }
	) {
		const newSocket = getSocket({ username, gameId })
		if (!newSocket) return toast("Error connecting to server")
		setUsername(username);
		setGameId(gameId);
		newSocket.addEventListener("open", () => {
			setSocket(newSocket)
			newSocket.send(JSON.stringify({ type: "join", username }))
		})
	}

	return (
		<div className="container pt-6">
			<form className="flex items-center content-center flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
				<div className="flex w-1/3 justify-between">
					<Label className="text-2xl text-center self-end" htmlFor="username">Who are you?</Label>
					<Input className="w-5/12 border-b-2 border-t-0 border-l-0 border-r-0 text-3xl " id="username" type="text" name="username" />
				</div>
				<div className="flex w-1/3 justify-between">
					<Label className="text-2xl text-center self-end" htmlFor="gameId">Game ID?</Label>
					<Input className="mb-3 w-5/12 border-b-2 border-t-0 border-l-0 border-r-0 text-3xl" id="gameId" type="text" name="gameId" />
				</div>
				<Button className="bg-slate-800 text-white rounded hover:bg-slate-600" type="submit">Join Game!</Button>
			</form>
		</div>
	);
}
