type Message = | {
  type: "join",
  username: string,
  players: {name: string, role: "X" | "O"}[],
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
}

type SquareValue = "X" | "O" | null

type Board = [SquareValue, SquareValue, SquareValue][]


type PlayerIdentity = "X" | "O"
