type Message = | {
  type: "join",
  username: string,
  players: Player[],
  role: "X" | "O"
} | {
  type: "leave",
  username: string
} | {
  type: "move",
  board: Board,
  activePlayer: PlayerIdentity
} | {
  type: "error",
  errorMessage: string
} | {
  type: "win",
  role: PlayerIdentity,
  username: string,
} | {
  type: "draw"
} | {
  type: "restart"
  board: Board,
  players: Player[]
}

type Player = {
  name: string,
  role: PlayerIdentity,
  playerId: string
}

type SquareValue = "X" | "O" | null

type Board = [SquareValue, SquareValue, SquareValue][]


type PlayerIdentity = "X" | "O"
