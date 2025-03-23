"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import MusicPlayer from "./music-player"

interface TitleScreenProps {
  onStart: (mode: "ai", difficulty: "easy" | "medium" | "hard") => void
}

export default function TitleScreen({ onStart }: TitleScreenProps) {
  const [blinking, setBlinking] = useState(true)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-gradient-to-b from-blue-500 to-blue-700 p-4">
      {/* Music Player */}
      <div className="absolute top-4 right-4 z-10">
        <MusicPlayer />
      </div>

      <div className="relative w-full max-w-md aspect-[4/3] mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Pokemon-style logo"
            width={400}
            height={300}
            className="object-contain"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 text-center pixel-font drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            POCKET MONSTERS
          </h1>
        </div>
      </div>

      <div className="bg-white border-4 border-black rounded-lg p-6 w-full max-w-md">
        <div className="space-y-4">
          <button
            onClick={() => onStart("ai", difficulty)}
            className="w-full py-3 bg-red-600 text-white text-xl font-bold rounded hover:bg-red-700 transition-colors pixel-font flex items-center justify-center"
          >
            {blinking ? "▶ 1 vs AI" : "  1 vs AI"}
          </button>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-center mb-2 font-bold pixel-font text-gray-800">Difficulty</h3>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => setDifficulty("easy")}
                className={`flex-1 py-2 rounded font-bold pixel-font text-sm ${
                  difficulty === "easy" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty("medium")}
                className={`flex-1 py-2 rounded font-bold pixel-font text-sm ${
                  difficulty === "medium" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficulty("hard")}
                className={`flex-1 py-2 rounded font-bold pixel-font text-sm ${
                  difficulty === "hard" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Hard
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-700 pixel-font">Choose your difficulty and start the battle!</div>
      </div>
    </div>
  )
}

