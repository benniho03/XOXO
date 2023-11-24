import { type ClassValue, clsx } from "clsx"
import localFont from "next/font/local"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSocket({username, gameId}: {username: string, gameId: string}){
  console.log(process.env)
  try {
    const socket = new WebSocket(`ws://xoxo-ihvp.vercel.app/?username=${username}&gameId=${gameId}`)
    socket.onerror = (error) => {
      throw error
    }
    return socket
  } catch (error) {
    return console.log(error)
  }

}

export const GlutenFont = localFont({
  src: '../../public/fonts/Gluten-VariableFont_slnt,wght.ttf',
  display: 'swap',
})