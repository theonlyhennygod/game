"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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
}

const defaultPlayerMonster: Monster = {
  id: 1,
  name: "Psyduck",
  sprite: "/Character 1_no_bg.png?height=150&width=150",
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
  sprite: "/Character 2_no_bg.png?height=150&width=150",
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

  const resetGame = () => {
    // In a more complex game, we would reset monster health, status, etc.
    console.log("Game reset")
  }

  return (
    <GameContext.Provider
      value={{
        playerMonster,
        enemyMonster,
        resetGame,
        gameMode,
        setGameMode,
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

