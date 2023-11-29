import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getSocket } from "@/lib/utils";
import toast from "react-hot-toast";
import z from "zod";
import { SubmitButton } from "./submitButton";

export default function UsernameComponent({
	setSocket,
	setUsername,
	setGameId
}: {
	setSocket: (socket: WebSocket) => void;
	setUsername: (username: string) => void;
	setGameId: (gameId: string) => void;
}) {
	async function login(formData: FormData){
		if(!validateWebSocketFormData(formData)) return toast.error("Please enter a username and game ID")
		const username = formData.get("username") as string
		const gameId = formData.get("gameId") as string || generateRandomGameId()
		
		const socket = getSocket({ username, gameId })

		if(!socket) return toast("Error connecting to server")

		console.log("Sind wa drinne wa")

		setUsername(username);
		setGameId(gameId);
		socket.addEventListener("open", () => {
			setSocket(socket)
			socket.send(JSON.stringify({ type: "join", username }))
		})
	}

	function generateRandomGameId() {
		const gameId = Math.floor(Math.random() * 10000).toString();
		return gameId;
	}

	

	function validateWebSocketFormData(formData: FormData) {
		const webSocketSchema = z.object({
			username: z.string().min(1),
			gameId: z.string(),
		});

		const formDataObject = {
			username: formData.get("username"),
			gameId: formData.get("gameId")
		}
		const result = webSocketSchema.safeParse(formDataObject);	

		if (!result.success) {
			return false
		}

		return true
	}

	return (
		<div className="container pt-6">
			<form className="flex items-center flex-col gap-4 mx-auto" action={login}>
				<div className="flex md:flex-row md:w-2/3 xl:w-5/12 gap-3 flex-col md:justify-end justify-center items-center">
					<Label className="text-2xl text-center" htmlFor="username">Who are you?</Label>
					<Input className="w-5/6 sm:w-8/12 md:w-5/12 border-b-2 border-t-0 border-l-0 border-r-0 text-3xl text-center lg:text-start" id="username" type="text" name="username" />
				</div>
				<div className="flex md:flex-row md:w-2/3 xl:w-5/12 gap-3 flex-col md:justify-end justify-center items-center mb-3">
					<Label className="text-2xl text-center" htmlFor="gameId">Game ID?</Label>
					<Input className="w-5/6 sm:w-8/12 md:w-5/12 border-b-2 border-t-0 border-l-0 border-r-0 text-3xl text-center md:text-start" id="gameId" type="text" name="gameId" />
				</div>
				<SubmitButton />
			</form>
		</div>
	);
}
