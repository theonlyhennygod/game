import type { Metadata } from 'next'
import './globals.css'
import { GameProvider } from '../components/game-context'
import MusicPlayer from '../components/music-player'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          {/* <MusicPlayer /> */}
          {children}
        </GameProvider>
      </body>
    </html>
  )
}
