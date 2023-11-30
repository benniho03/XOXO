import { type ClassValue, clsx } from "clsx"
import localFont from "next/font/local"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSocket({ username, gameId, playerId }: { username: string, gameId: string, playerId: string }) {

  let socket;

  if (!socket) {
    try {
      socket = new WebSocket(`${process.env.WS_URL}/?username=${username}&gameId=${gameId}&playerId=${playerId}`)
      return socket
    } catch (error) {
      return console.log(error)
    }
  }

  return socket

}

export const GlutenFont = localFont({
  src: '../../public/fonts/Gluten-VariableFont_slnt,wght.ttf',
  display: 'swap',
})