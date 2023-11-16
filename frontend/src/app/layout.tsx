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
      <body className={GlutenFont.className}>
        <Header />
        <main className=''>
          <Toaster />

          {children}
        </main>
      </body>
    </html>
  )
}
