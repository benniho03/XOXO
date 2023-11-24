import { type ClassValue, clsx } from "clsx"
import localFont from "next/font/local"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSocket({username, gameId}: {username: string, gameId: string}){
  console.log(process.env)
  try {
    console.log("URL", process.env.WS_URL)
    const socket = new WebSocket(`${process.env.WS_URL}/?username=${username}&gameId=${gameId}`)
    return socket
  } catch (error) {
    return console.log(error)
  }

}

export const GlutenFont = localFont({
  src: '../../public/fonts/Gluten-VariableFont_slnt,wght.ttf',
  display: 'swap',
})