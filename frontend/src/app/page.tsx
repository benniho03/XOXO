"use client";
import MessageFeed from "@/components/messageFeed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UsernameComponent from "@/components/username";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function Home() {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [username, setUsername] = useState("");
	const [messageInput, setMessageInput] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);

	if (!socket || !username) {
		return (
			<UsernameComponent
				setSocket={setSocket}
				setUsername={setUsername}
			/>
		);
	}

	socket.addEventListener("message", (event) => {
		const data = JSON.parse(event.data) as Message;

		setMessages([...messages, data]);
	});


	socket.addEventListener("close", (event) => {
		setSocket(null);
		setUsername("");
	});

	function sendMessage({
		message,
		socket,
	}: {
		message: string;
		socket: WebSocket;
	}) {
		socket.send(JSON.stringify({ type: "message", username, message }));
	}
	return (
		<div className="container">
			<div>Logged in as: {username}</div>
			<Label htmlFor="message">Message</Label>
			<Input
				id="message"
				type="text"
				onChange={(e) => setMessageInput(e.target.value)}
			/>
			<Button
				onClick={() =>
					sendMessage({
						message: messageInput,
						socket,
					})
				}
			>
				Send Message
			</Button>
			<MessageFeed messages={messages} />
		</div>
	);

}
