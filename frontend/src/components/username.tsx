import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export default function UsernameComponent({
	setSocket,
	setUsername,
}: {
	setSocket: (socket: WebSocket) => void;
	setUsername: (username: string) => void;
}) {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		login(setSocket, e.currentTarget.username.value);
	}

	function login(setSocket: (socket: WebSocket) => void, username: string) {
		const socket = new WebSocket(`ws://localhost:8080/?username=${username}`);
		
		setUsername(username);
		setSocket(socket);
	}

	return (
		<div className="container pt-6">
			<form className="flex items-center content-center flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
				<Label className="text-2xl text-center" htmlFor="username">Who are you?</Label>
				<Input className="w-1/2 border border-slate-500 rounded" id="username" type="text" name="username" />
				<Button className="bg-slate-800 text-white rounded hover:bg-slate-600" type="submit">Submit</Button>
			</form>
		</div>
	);
}
