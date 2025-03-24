"use client"

import { motion } from "framer-motion"

interface Move {
  name: string
  type: string
  power: number
}

interface BattleMenuProps {
  moves: Move[]
  onSelectMove: (index: number) => void
  disabled: boolean
}

export default function BattleMenu({ moves, onSelectMove, disabled }: BattleMenuProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-full">
      {moves.map((move, index) => (
        <motion.button
          key={index}
          onClick={() => onSelectMove(index)}
          disabled={disabled}
          className={`
            border-2 border-gray-400 rounded p-3 md:p-4
            flex flex-col items-start justify-center
            hover:bg-gray-100 transition-colors
            pixel-font text-sm md:text-base
            ${getTypeColor(move.type)}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="font-bold text-black">{move.name}</span>
          <span className="text-xs text-black">PP: 10/10</span>
        </motion.button>
      ))}
    </div>
  )
}

function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    normal: "bg-gray-200",
    fire: "bg-red-200",
    water: "bg-blue-200",
    electric: "bg-yellow-200",
    grass: "bg-green-200",
    ice: "bg-cyan-200",
    fighting: "bg-orange-200",
    poison: "bg-purple-200",
    ground: "bg-amber-200",
    flying: "bg-indigo-200",
    psychic: "bg-pink-200",
    bug: "bg-lime-200",
    rock: "bg-stone-200",
    ghost: "bg-violet-200",
    dragon: "bg-teal-200",
    dark: "bg-slate-300",
    steel: "bg-zinc-200",
    fairy: "bg-rose-200",
  }

  return typeColors[type.toLowerCase()] || "bg-gray-200"
}

