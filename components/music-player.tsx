"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Volume1, Volume } from "lucide-react"
import { motion } from "framer-motion"

interface MusicPlayerProps {
  className?: string
}

export default function MusicPlayer({ className = "" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio("/song3.mp3")
      audioRef.current.loop = true
      audioRef.current.volume = volume
    }

    // Play or pause based on state
    if (isPlaying) {
      const playPromise = audioRef.current.play()
      
      // Handle play() promise to avoid DOMException
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Add a subtle fade in
            const audio = audioRef.current!
            audio.volume = 0
            const fadeIn = setInterval(() => {
              if (audio.volume < volume) {
                audio.volume = Math.min(audio.volume + 0.1, volume)
              } else {
                clearInterval(fadeIn)
              }
            }, 100)
          })
          .catch((error) => {
            console.error("Audio play failed:", error)
            setIsPlaying(false)
          })
      }
    } else if (audioRef.current) {
      // Fade out before pausing
      const fadeOut = setInterval(() => {
        if (audioRef.current!.volume > 0.1) {
          audioRef.current!.volume -= 0.1
        } else {
          audioRef.current!.pause()
          clearInterval(fadeOut)
        }
      }, 100)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, volume])

  const togglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  // Get the appropriate icon based on playing state and volume
  const getVolumeIcon = () => {
    if (!isPlaying) return <VolumeX className="w-6 h-6 text-gray-600" />
    if (volume > 0.7) return <Volume2 className="w-6 h-6 text-blue-600" />
    if (volume > 0.3) return <Volume1 className="w-6 h-6 text-blue-600" />
    return <Volume className="w-6 h-6 text-blue-600" />
  }

  return (
    <motion.button
      onClick={togglePlay}
      className={`p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all ${className}`}
      aria-label={isPlaying ? "Mute music" : "Play music"}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {getVolumeIcon()}
    </motion.button>
  )
}

