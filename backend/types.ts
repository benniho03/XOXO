export type Message =
  | {
    type: "join";
  }
  | {
    type: "message";
    message: string;
  }
  | MoveMessage

export type MoveMessage = {
  type: "move";
  player: "X" | "O";
  row: number;
  col: number;
}

export type GameInfo = {
  username: string,
  gameId: string
}

export type Cell = "X" | "O" | null

export type Board = Cell[][]

export type GameState = {
  gameId: string
  board:  Board
  activePlayer: "X" | "O",
  players: {name: string, role: "X" | "O"}[]
}