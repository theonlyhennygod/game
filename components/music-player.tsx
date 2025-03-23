"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"

interface MusicPlayerProps {
  className?: string
}

export default function MusicPlayer({ className = "" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio("/placeholder.svg") // Replace with actual music file
      audioRef.current.loop = true
      audioRef.current.volume = 0.5
    }

    // Play or pause based on state
    if (isPlaying) {
      const playPromise = audioRef.current.play()

      // Handle play() promise to avoid DOMException
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio play failed:", error)
          setIsPlaying(false)
        })
      }
    } else if (audioRef.current) {
      audioRef.current.pause()
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <button
      onClick={togglePlay}
      className={`p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all ${className}`}
      aria-label={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? <Volume2 className="w-6 h-6 text-blue-600" /> : <VolumeX className="w-6 h-6 text-gray-600" />}
    </button>
  )
}

