"use client"

import { useState } from "react"
import TitleScreen from "@/components/title-screen"
import BattleScene from "@/components/battle-scene"
import TopicModal from "@/components/topic-modal"
import { GameProvider } from "@/components/game-context"

export default function Home() {
  const [gameState, setGameState] = useState<"title" | "battle">("title")
  const [gameMode, setGameMode] = useState<"ai" | null>(null)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false)
  const [currentTopic, setCurrentTopic] = useState<string | null>(null)
  const [isInitialSelection, setIsInitialSelection] = useState(true)

  const handleGameStart = (mode: "ai", selectedDifficulty: "easy" | "medium" | "hard") => {
    setGameMode(mode)
    setDifficulty(selectedDifficulty)
    setIsInitialSelection(true)
    setIsTopicModalOpen(true)
  }

  const handleGameOver = () => {
    // For subsequent topic selections after a battle
    setIsInitialSelection(false)
    setIsTopicModalOpen(true)
  }

  const handleSelectTopic = (topic: string) => {
    setCurrentTopic(topic)
    setIsTopicModalOpen(false)

    // If this is the initial selection, start the battle
    if (isInitialSelection) {
      setGameState("battle")
      setIsInitialSelection(false)
    }
    // Otherwise, the battle is already in progress and will reset with the new topic
  }

  return (
    <GameProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        {gameState === "title" && (
          <>
            <TitleScreen onStart={handleGameStart} />
            <TopicModal
              isOpen={isTopicModalOpen}
              onClose={() => {
                setIsTopicModalOpen(false)
                // If user closes the modal during initial selection, go back to title screen options
                if (isInitialSelection) {
                  setGameMode(null)
                }
              }}
              onSelectTopic={handleSelectTopic}
              initialPrompt={isInitialSelection ? "Choose your first battle topic!" : "Choose your next battle topic!"}
            />
          </>
        )}

        {gameState === "battle" && (
          <>
            <BattleScene
              onGameOver={handleGameOver}
              gameMode="ai"
              difficulty={difficulty}
              topic={currentTopic || "Battle"}
            />
            <TopicModal
              isOpen={isTopicModalOpen}
              onClose={() => setIsTopicModalOpen(false)}
              onSelectTopic={handleSelectTopic}
              initialPrompt="Choose your next battle topic!"
            />
          </>
        )}
      </main>
    </GameProvider>
  )
}

