"use client"

import { motion } from "framer-motion"

interface HealthBarProps {
  current: number
  max: number
}

export default function HealthBar({ current, max }: HealthBarProps) {
  const percentage = (current / max) * 100
  const barColor = percentage > 50 ? "bg-green-500" : percentage > 20 ? "bg-yellow-500" : "bg-red-500"

  return (
    <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${barColor}`}
        initial={{ width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      />
    </div>
  )
}

