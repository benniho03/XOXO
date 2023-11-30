import { ServerWebSocket } from "bun";
import { Message, GameInfo, GameState, MoveMessage, Board } from "./types";
const games = new Map<string, GameState>();

const server = Bun.serve<GameInfo>({
	fetch(req, server) {
		const url = new URL(req.url);
		const username = url.searchParams.get("username");
		const gameId = url.searchParams.get("gameId");
		const playerId = url.searchParams.get("playerId");

		if (!username || !gameId || !playerId) return new Response("Missing username or gameId", { status: 400 });

		const game = games.get(gameId)

		if (game && game.players[1].name) return new Response("Game is full", { status: 400 })

		const success = server.upgrade(req, {
			data: {
				username,
				gameId,
				playerId
			},
		});
		if (success) return;
		return new Response("Could not upgrade to websocket", { status: 400 });
	},
	websocket: {
		async open(client) {
			client.subscribe(client.data.gameId);

			const game = games.get(client.data.gameId);
			if (!game) {
				games.set(client.data.gameId, createDefaultGame(client.data.gameId))
				return
			}

			if (!game.players[0].name) {
				game.players[0].name = client.data.username
				game.players[0].playerId = client.data.playerId
				return
			}

			game.players[1].name = client.data.username
			game.players[1].playerId = client.data.playerId

		},
		async message(client, message) {

			const clientMessage: Message = JSON.parse(message.toString());

			const game = games.get(client.data.gameId);
			if (!game) {
				console.error("Game not found")
				return
			}

			switch (clientMessage.type) {
				case "join":
					console.log(`${client.data.username} joined Game #${client.data.gameId}`)
					return handleJoin({ username: client.data.username, game })
				case "move":
					console.log(`${client.data.username} made a move`)
					return handleMove({ clientMessage, game });	
				case "restart":
					handleRestart(client, game);
					return
				default:
					console.log("Error")
					return handleError({ gameId: client.data.gameId, errorMessage: "Invalid message type" })
			}

		},
		async close(client) {
			games.delete(client.data.gameId)
			server.publish(
				client.data.gameId,
				JSON.stringify({
					type: "leave",
					username: client.data.username,
				})
			);
			console.log(`${client.data.username} left`)
			client.unsubscribe(client.data.gameId);
		}
	},
	port: 8080,
});

console.log(`🚀 Listening on localhost: ${server.port} 🚀`);

function handleRestart(client: ServerWebSocket<GameInfo>, game: GameState) {
	console.log("Restart");
	if(!game.restart){
		game.restart = true;
		return
	}
	const newGame = createDefaultGame(client.data.gameId);
	newGame.players = [...game.players];
	server.publish(
		client.data.gameId,
		JSON.stringify({
			type: "restart",
			board: newGame.board,
			players: [newGame.players[1], newGame.players[0]]
		})
	);
	games.set(client.data.gameId, newGame);
}

function handleError({ gameId, errorMessage }: { gameId: string, errorMessage: string }) {
	server.publish(gameId, JSON.stringify({ type: "error", errorMessage }));
}

function handleMove({ clientMessage, game }: { clientMessage: MoveMessage, game: GameState }) {
	if (game.activePlayer !== clientMessage.player) return handleError({ gameId: game.gameId, errorMessage: "Not your turn" })

	// Make shallow copy of board, then update board with move from client
	const newBoard = game.board.map(row => [...row]);
	newBoard[clientMessage.row][clientMessage.col] = clientMessage.player;
	game.board = newBoard;

	// Switch active player
	game.activePlayer = game.activePlayer === "X" ? "O" : "X";

	server.publish(game.gameId, JSON.stringify({ type: "move", board: game.board, activePlayer: game.activePlayer }));

	const winningRole = checkForWinner(game.board)
	const winner = game.players.find(player => player.role === winningRole)

	if (winningRole && winner) {
		winner.wins++
		server.publish(game.gameId, JSON.stringify({
			type: "win",
			role: winningRole,
			username: winner.name
		}))
		return
	}

	if (checkForDraw(game.board)) {
		server.publish(game.gameId, JSON.stringify({
			type: "draw",
		}))
		return
	}

}

export function checkForDraw(board: Board) {
	return board.every(row => row.every(square => square));
}

export function checkForWinner(board: Board) {
	return checkRowsForWinner(board) || checkColsForWinner(board) || checkDiagonalsForWinner(board)
}


export function checkRowsForWinner(board: Board) {
	const result = board.map(row => isArrayFilledWithSameValue(row))
	if (result.includes("X")) return "X"
	if (result.includes("O")) return "O"
	return false
}

export function checkColsForWinner(board: Board) {
	const cols = board[0].map((_, i) => board.map(row => row[i]))
	const result = cols.map(col => isArrayFilledWithSameValue(col))
	if (result.includes("X")) return "X"
	if (result.includes("O")) return "O"
	return false
}

export function checkDiagonalsForWinner(board: Board) {
	const diagonals = [[board[0][0], board[1][1], board[2][2]], [board[0][2], board[1][1], board[2][0]]]
	const result = diagonals.map(diagonal => isArrayFilledWithSameValue(diagonal))
	if (result.includes("X")) return "X"
	if (result.includes("O")) return "O"
	return false
}

export function isArrayFilledWithSameValue(arr: ("X" | "O" | null)[]) {
	const first = arr[0]
	if (!first) return false
	return arr.every(square => square === first) ? first : false
}

function createDefaultGame(gameId: string): GameState {
	return {
		gameId,
		board: createBoard(3),
		activePlayer: "X" as const,
		players: [{ name: "", role: "X" as const, playerId: "", wins: 0 }, { name: "", role: "O" as const, playerId: "", wins: 0 }],
		restart: false
	}
}

function handleJoin({ username, game }: { username: string, game: GameState }) {

	const { players, gameId } = game

	const isFirstPlayer = !players[0].name
	isFirstPlayer ? players[0].name = username : players[1].name = username

	server.publish(
		gameId,
		JSON.stringify({
			type: "join",
			username,
			players,
			role: isFirstPlayer ? "X" : "O"
		})
	);
}

function createBoard(size: number): Board {
	return Array(size).fill(Array(size).fill(null))
}