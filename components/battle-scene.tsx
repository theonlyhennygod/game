"use client"

import { useState, useEffect } from "react"
import { useGameContext } from "./game-context"
import BattleMenu from "./battle-menu"
import { motion, AnimatePresence } from "framer-motion"

interface BattleSceneProps {
  onGameOver: () => void
  gameMode: "ai"
  difficulty: "easy" | "medium" | "hard"
  topic: string
  backgroundUrl: string
}

export default function BattleScene({ onGameOver, gameMode, difficulty, topic, backgroundUrl }: BattleSceneProps) {
  const { playerMonster, enemyMonster, resetGame, generateMonsterImage } = useGameContext()
  const [playerHealth, setPlayerHealth] = useState(100)
  const [enemyHealth, setEnemyHealth] = useState(100)
  const [battleText, setBattleText] = useState(`Battle topic: ${topic}. What will you do?`)
  const [turn, setTurn] = useState<"player" | "enemy">("player")
  const [battleState, setBattleState] = useState<"choosing" | "attacking" | "enemyAttacking" | "finished">("choosing")

  // Animation states
  const [playerAttacking, setPlayerAttacking] = useState(false)
  const [enemyAttacking, setEnemyAttacking] = useState(false)
  const [playerHit, setPlayerHit] = useState(false)
  const [enemyHit, setEnemyHit] = useState(false)
  const [attackEffect, setAttackEffect] = useState<{ visible: boolean; x: number; y: number; type: string }>({
    visible: false,
    x: 0,
    y: 0,
    type: "normal",
  })

  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [prompt, setPrompt] = useState<string>("")
  const [generatedImage, setGeneratedImage] = useState<string>("")
  const [generatedEnemyImage, setGeneratedEnemyImage] = useState<string>("")
  const [generatedBackground, setGeneratedBackground] = useState("")
  const [selectedImages, setSelectedImages] = useState<{player?: string, enemy?: string}>({})

  // Background loading state
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(true);

  // Reset battle when topic changes
  useEffect(() => {
    setPlayerHealth(100)
    setEnemyHealth(100)
    setBattleText(`Battle topic: ${topic}. What will you do?`)
    setTurn("player")
    setBattleState("choosing")
  }, [topic])

  // Get difficulty multiplier for AI damage
  const getDifficultyMultiplier = () => {
    switch (difficulty) {
      case "easy":
        return 0.7
      case "medium":
        return 1.0
      case "hard":
        return 1.5
      default:
        return 1.0
    }
  }

  // Handle enemy turn
  useEffect(() => {
    if (turn === "enemy" && battleState === "enemyAttacking") {
      const timer = setTimeout(() => {
        const randomMoveIndex = Math.floor(Math.random() * enemyMonster.moves.length)
        const move = enemyMonster.moves[randomMoveIndex]
        const baseDamage = move.power + Math.floor(Math.random() * 10)
        const difficultyMultiplier = getDifficultyMultiplier()
        const damage = Math.floor(baseDamage * difficultyMultiplier)

        // Start enemy attack animation
        setEnemyAttacking(true)
        setBattleText(`${enemyMonster.name} used ${move.name}!`)

        // Show attack effect
        setTimeout(() => {
          setEnemyAttacking(false)
          setAttackEffect({
            visible: true,
            x: window.innerWidth * 0.25,
            y: window.innerHeight * 0.65,
            type: move.type.toLowerCase(),
          })

          // Show player hit animation
          setTimeout(() => {
            setAttackEffect((prev) => ({ ...prev, visible: false }))
            setPlayerHit(true)
            setPlayerHealth((prev) => Math.max(0, prev - damage))
            setBattleText(`${enemyMonster.name} used ${move.name}! It did ${damage} damage!`)

            setTimeout(() => {
              setPlayerHit(false)

              if (playerHealth - damage <= 0) {
                setBattleText(`${playerMonster.name} fainted! You lost the battle!`)
                setBattleState("finished")
                setTimeout(() => {
                  resetGame()
                  onGameOver()
                }, 2000)
              } else {
                setBattleText(`Topic: ${topic}. What will you do?`)
                setTurn("player")
                setBattleState("choosing")
              }
            }, 1000)
          }, 500)
        }, 500)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [turn, battleState, enemyMonster, playerHealth, onGameOver, resetGame, playerMonster.name, topic, difficulty])

  const handleAttack = (moveIndex: number) => {
    if (battleState !== "choosing") return

    setBattleState("attacking")
    const move = playerMonster.moves[moveIndex]
    const damage = move.power + Math.floor(Math.random() * 10)

    // Start player attack animation
    setPlayerAttacking(true)
    setBattleText(`${playerMonster.name} used ${move.name}!`)

    // Show attack effect after monster moves forward
    setTimeout(() => {
      setPlayerAttacking(false)
      setAttackEffect({
        visible: true,
        x: window.innerWidth * 0.75,
        y: window.innerHeight * 0.35,
        type: move.type.toLowerCase(),
      })

      // Show enemy hit animation
      setTimeout(() => {
        setAttackEffect((prev) => ({ ...prev, visible: false }))
        setEnemyHit(true)
        setEnemyHealth((prev) => Math.max(0, prev - damage))
        setBattleText(`${playerMonster.name} used ${move.name}! It did ${damage} damage!`)

        setTimeout(() => {
          setEnemyHit(false)

          if (enemyHealth - damage <= 0) {
            setBattleText(`${enemyMonster.name} fainted! You won the battle!`)
            setBattleState("finished")
            setTimeout(() => {
              resetGame()
              onGameOver()
            }, 2000)
          } else {
            setTurn("enemy")
            setBattleState("enemyAttacking")
          }
        }, 1000)
      }, 500)
    }, 500)
  }

  const handleGenerateNewMonsterImage = async () => {
    if (!prompt.trim()) {
      setBattleText("Please enter an image description first!");
      return;
    }

    try {
      setIsGeneratingImage(true);
      
      // Generate player image
      const playerResponse = await fetch('/api/openai', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          prompt: `Pixel art of ${prompt} as a friendly monster, vibrant colors, cartoon style`,
          count: 1
        }),
      });

      // Generate enemy image
      const enemyResponse = await fetch('/api/openai', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          prompt: `Pixel art of ${prompt} as an evil monster, dark colors, cartoon style`,
          count: 1
        }),
      });

      // Generate background
      const bgResponse = await fetch('/api/openai', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          prompt: `Pixel art battle arena for ${prompt}, isometric view, vibrant colors`,
          count: 1
        }),
      });

      const [playerData, enemyData, bgData] = await Promise.all([
        playerResponse.json(),
        enemyResponse.json(),
        bgResponse.json()
      ]);

      // Handle responses
      const imageUrls = [
        playerData.imageUrls?.[0],
        enemyData.imageUrls?.[0],
        bgData.imageUrls?.[0]
      ];

      if (imageUrls.every(url => !!url)) {
        setGeneratedImage(imageUrls[0]);
        setGeneratedEnemyImage(imageUrls[1]);
        setGeneratedBackground(imageUrls[2]);
        setBattleText("Generated all battle assets!");
      } else {
        throw new Error("Failed to generate some images");
      }
      
    } catch (error) {
      console.error('Generation failed:', error);
      setBattleText("Failed to generate assets. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSelectPlayerImage = (url: string) => {
    setSelectedImages(prev => ({...prev, player: url}));
    // Update player monster sprite
  };

  const handleSelectEnemyImage = (url: string) => {
    setSelectedImages(prev => ({...prev, enemy: url}));
    // Update enemy monster sprite
  };

  // Background image loading handler
  useEffect(() => {
    if (backgroundUrl) {
      setIsBackgroundLoading(true);
      const img = new Image();
      img.src = backgroundUrl;
      img.onerror = () => {
        setGeneratedBackground('/fallback-bg.jpg'); // Add fallback image
      };
    }
  }, [backgroundUrl]);

  return (
<<<<<<< HEAD
    <div 
      className="relative w-full h-screen border-4 border-black overflow-hidden"
      style={{ 
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {!backgroundUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600" />
      )}
      {isBackgroundLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="pixel-font text-white text-xl animate-pulse">
            Loading battle arena...
          </div>
        </div>
      )}
      
=======
    <div className="relative w-full h-screen bg-gradient-to-b from-green-300 to-green-500 border-4 border-black overflow-hidden">
      {/* Music Player */}
      <div className="absolute top-2 right-2 z-10">
        <MusicPlayer />
      </div>

      {/* Game Mode and Difficulty Indicator */}
      <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full border-2 border-black">
        <span className="pixel-font text-sm font-bold text-black">
          1 vs AI - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </div>

      {/* Topic Indicator */}
      <div className="absolute top-12 left-2 bg-white px-3 py-1 rounded-full border-2 border-black max-w-[200px] truncate">
        <span className="pixel-font text-sm font-bold text-black">Topic: {topic}</span>
      </div>

>>>>>>> f8d467b0c65614f6d98d0d214cc657202763db62
      {/* Player health bar - top left */}
      <div className="absolute top-[10%] left-[5%] w-[40%]">
        <div className="bg-black bg-opacity-80 rounded-lg p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-white pixel-font">{playerMonster.name}</span>
            <span className="text-white pixel-font">Lv.{playerMonster.level}</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400"
              initial={{ width: `${(playerHealth / 100) * 100}%` }}
              animate={{ width: `${(playerHealth / 100) * 100}%` }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
            />
          </div>
          <div className="text-right text-white pixel-font text-xs mt-1">HP</div>
        </div>
      </div>

      {/* Enemy health bar - top right */}
      <div className="absolute top-[10%] right-[5%] w-[40%]">
        <div className="bg-black bg-opacity-80 rounded-lg p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-white pixel-font">{enemyMonster.name}</span>
            <span className="text-white pixel-font">Lv.{enemyMonster.level}</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-400"
              initial={{ width: `${(enemyHealth / 100) * 100}%` }}
              animate={{ width: `${(enemyHealth / 100) * 100}%` }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
            />
          </div>
          <div className="text-right text-white pixel-font text-xs mt-1">HP</div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-blue-400 w-[68%]"></div>
          </div>
          <div className="flex justify-between text-white pixel-font text-xs">
            <span>EXP</span>
            <span>17/25</span>
          </div>
        </div>
      </div>

      {/* Enemy monster - right side */}
      <motion.div
        className="absolute top-[30%] right-[20%]"
        animate={{
          x: enemyAttacking ? -50 : enemyHit ? 20 : 0,
          y: enemyHit ? 5 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: enemyHit ? 5 : 15,
          duration: enemyAttacking ? 0.3 : 0.2
        }}
      >
        <div className="relative">
          <div className="w-64 h-64 bg-green-700 rounded-full absolute -z-10"></div>
          <div className="w-80 h-80 flex items-center justify-center">
            <img
              src={generatedEnemyImage || enemyMonster.sprite || "/placeholder.svg"}
              alt={enemyMonster.name}
<<<<<<< HEAD
              className="w-32 h-32 object-contain pixelated"
              style={{ width: 'auto', height: 'auto' }}
=======
              className="w-64 h-64 object-contain pixelated"
>>>>>>> f8d467b0c65614f6d98d0d214cc657202763db62
            />
          </div>
        </div>
      </motion.div>

      {/* Player monster - bottom left, shown from behind */}
      <motion.div
        className="absolute bottom-[30%] left-[15%]"
        animate={{
          x: playerAttacking ? 50 : playerHit ? 20 : 0,
          y: playerHit ? 5 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: playerHit ? 5 : 15,
          duration: playerAttacking ? 0.3 : 0.2
        }}
      >
<<<<<<< HEAD
        <div className="w-32 h-32 bg-gray-400 rounded-md flex items-center justify-center">
          {selectedImages.player ? (
            <img
              src={selectedImages.player}
              alt={playerMonster.name}
              className="w-24 h-24 object-contain pixelated"
              style={{ width: 'auto', height: 'auto' }}
            />
          ) : (
            <img
              src="/psyduck.jpg"
              alt="Psyduck"
              className="w-24 h-24 object-cover rounded-full"
            />
          )}
=======
        <div className="relative">
          <div className="w-64 h-64 bg-green-700 rounded-full absolute -z-10"></div>
          <div className="w-80 h-80 flex items-center justify-center">
            <img
              src={playerMonster.sprite || "/placeholder.svg"}
              alt={playerMonster.name}
              className="w-64 h-64 object-contain pixelated"
            />
          </div>
>>>>>>> f8d467b0c65614f6d98d0d214cc657202763db62
        </div>
      </motion.div>

      {/* Attack Effect Animation */}
      <AnimatePresence>
        {attackEffect.visible && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: attackEffect.x,
              top: attackEffect.y,
              zIndex: 20,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`w-16 h-16 rounded-full ${getAttackEffectColor(attackEffect.type)}`}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">{getAttackEffectIcon(attackEffect.type)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Battle interface */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-white border-t-4 border-black">
        <div className="h-full flex flex-col">
          {battleState === "choosing" ? (
            <>
              <div className="p-2 border-b-2 border-gray-300 pixel-font">{battleText}</div>
              <BattleMenu
                moves={playerMonster.moves}
                onSelectMove={handleAttack}
                disabled={battleState !== "choosing"}
              />
            </>
          ) : (
            <div className="p-4 flex items-center justify-center h-full pixel-font">{battleText}</div>
          )}
        </div>
      </div>

      {/* Image Generation Controls */}
      <div className="absolute top-2 right-20 z-10 flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter image prompt..."
          className="px-3 py-1 rounded-full border-2 border-black pixel-font text-sm w-64"
          disabled={isGeneratingImage}
        />
        <button
          onClick={handleGenerateNewMonsterImage}
          disabled={isGeneratingImage}
          className="bg-white px-3 py-1 rounded-full border-2 border-black pixel-font text-sm whitespace-nowrap"
        >
          {isGeneratingImage ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
    </div>
  )
}

// Helper functions for attack effects
function getAttackEffectColor(type: string): string {
  const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-cyan-400",
    fighting: "bg-orange-500",
    poison: "bg-purple-500",
    ground: "bg-amber-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-stone-500",
    ghost: "bg-violet-500",
    dragon: "bg-teal-500",
    dark: "bg-slate-700",
    steel: "bg-zinc-400",
    fairy: "bg-rose-400",
  }

  return typeColors[type] || "bg-gray-400"
}

function getAttackEffectIcon(type: string): string {
  const typeIcons: Record<string, string> = {
    normal: "●",
    fire: "��",
    water: "💧",
    electric: "⚡",
    grass: "🌿",
    ice: "❄️",
    fighting: "👊",
    poison: "☠️",
    ground: "⛰️",
    flying: "🌪️",
    psychic: "🔮",
    bug: "🐛",
    rock: "🪨",
    ghost: "👻",
    dragon: "🐉",
    dark: "🌑",
    steel: "⚙️",
    fairy: "✨",
  }

  return typeIcons[type] || "●"
}

