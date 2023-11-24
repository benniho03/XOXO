import { GlutenFont } from '@/lib/utils'
import './globals.css'
import Header from '../components/header'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'XOXO',
  description: 'Online Tic-Tac-Toe with friends',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${GlutenFont.className} bg-[url('./paper-bg.jpg')] bg-cover `}
      style={{minHeight: "100vh"}}>
        <Header />
        <main className='flex flex-col justify-around items-end'>
          <Toaster />

          {children}
        </main>
        <p className='text-center'><a href="https://www.freepik.com/free-vector/crumpled-blue-checkered-paper-texture-realisric_29567568.htm">Image by upklyak</a> on Freepik</p>
      </body>
    </html>
  )
}
