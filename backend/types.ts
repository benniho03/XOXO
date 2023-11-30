export type Message =
  | {
    type: "join";
  }
  | {
    type: "message";
    message: string;
  }
  | MoveMessage
  | {
    type: "restart"
  }

export type MoveMessage = {
  type: "move";
  player: "X" | "O";
  row: number;
  col: number;
}

export type GameInfo = {
  username: string,
  gameId: string,
  playerId: string
}

export type Cell = "X" | "O" | null

export type Board = Cell[][]

export type Player = {
  name: string,
  role: "X" | "O",
  playerId: string,
  wins: number
}

export type GameState = {
  gameId: string
  board:  Board
  activePlayer: "X" | "O",
  players: Player[],
  restart: boolean
}