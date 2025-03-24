"use client"

import { useGameContext } from "./game-context"
import { Volume2, VolumeX } from "lucide-react"

export default function MusicPlayer() {
  const { isMusicPlaying, toggleMusic } = useGameContext()

  return (
    <button
      onClick={toggleMusic}
      className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
      aria-label={isMusicPlaying ? "Mute music" : "Play music"}
    >
      {isMusicPlaying ? (
        <Volume2 className="w-6 h-6 text-blue-600" />
      ) : (
        <VolumeX className="w-6 h-6 text-gray-600" />
      )}
    </button>
  )
}

