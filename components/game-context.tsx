"use client"

import { createContext, useContext, useState, type ReactNode, useRef, useEffect } from "react"
import { generateBattleMessages } from '@/lib/battle-utils'
import { generateCharacterImage } from '@/lib/character-utils'

interface Move {
  name: string
  type: string
  power: number
}

interface Monster {
  id: number
  name: string
  sprite: string
  level: number
  moves: Move[]
}

interface GameContextType {
  playerMonster: Monster
  enemyMonster: Monster
  resetGame: () => void
  setGameMode: (mode: "1v1" | "ai") => void
  gameMode: "1v1" | "ai" | null
  generateBattleNarrative: (move1: string, move2: string) => Promise<BattleResponse>
  generateMonsterImage: (prompt: string) => Promise<string>
  isMusicPlaying: boolean
  currentTrack: string
  toggleMusic: () => void
  setTrack: (track: string) => void
}

const defaultPlayerMonster: Monster = {
  id: 1,
  name: "Psyduck",
  sprite: "/placeholder.svg?height=100&width=100",
  level: 5,
  moves: [
    { name: "Scratch", type: "Normal", power: 10 },
    { name: "Water Gun", type: "Water", power: 15 },
    { name: "Confusion", type: "Psychic", power: 20 },
    { name: "Headache", type: "Psychic", power: 25 },
  ],
}

const defaultEnemyMonster: Monster = {
  id: 2,
  name: "Oshawott",
  sprite: "/placeholder.svg?height=100&width=100",
  level: 7,
  moves: [
    { name: "Tackle", type: "Normal", power: 10 },
    { name: "Water Gun", type: "Water", power: 15 },
    { name: "Razor Shell", type: "Water", power: 20 },
    { name: "Aqua Jet", type: "Water", power: 18 },
  ],
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [playerMonster] = useState<Monster>(defaultPlayerMonster)
  const [enemyMonster] = useState<Monster>(defaultEnemyMonster)
  const [gameMode, setGameMode] = useState<"1v1" | "ai" | null>(null)
  const [battleState, setBattleState] = useState<string>("")
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState("/music/song3.mp3")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(currentTrack)
    audioRef.current.loop = true
    audioRef.current.volume = 0.5
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return
    
    if (isMusicPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isMusicPlaying])

  const toggleMusic = () => {
    setIsMusicPlaying(prev => !prev)
  }

  const setTrack = (track: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = track
      audioRef.current.play()
      setIsMusicPlaying(true)
    }
  }

  const resetGame = () => {
    // In a more complex game, we would reset monster health, status, etc.
    console.log("Game reset")
  }

  const generateBattleNarrative = async (moveKey1: string, moveKey2: string) => {
    const player1 = {
      name: playerMonster.name,
      persona: "Determined fighter",
      hp: 100, // Add proper HP tracking
      ...playerMonster
    };

    const player2 = {
      name: enemyMonster.name,
      persona: "Fierce competitor",
      hp: 100, // Add proper HP tracking
      ...enemyMonster
    };

    const response = await generateBattleMessages(
      player1,
      player2,
      battleState,
      player1[moveKey1],
      player2[moveKey2]
    );

    setBattleState(response.summary);
    return response;
  };

  const generateMonsterImage = async (prompt: string) => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }

      if (!responseData.imageUrl) {
        throw new Error('Received invalid response from server');
      }

      return responseData.imageUrl;
      
    } catch (error: any) {
      console.error('Generation failed:', {
        error: error.message,
        prompt: prompt,
        timestamp: new Date().toISOString()
      });
      
      throw new Error(`Image generation failed: ${error.message}`);
    }
  };

  return (
    <GameContext.Provider
      value={{
        playerMonster,
        enemyMonster,
        resetGame,
        gameMode,
        setGameMode,
        generateBattleNarrative,
        generateMonsterImage,
        isMusicPlaying,
        currentTrack,
        toggleMusic,
        setTrack,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}

