"use client"

import type React from "react"

import { useState } from "react"
import { X, Globe } from "lucide-react"

interface TopicModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTopic: (topic: string) => void
  initialPrompt?: string
}

export default function TopicModal({
  isOpen,
  onClose,
  onSelectTopic,
  initialPrompt = "Choose Next Battle Topic",
}: TopicModalProps) {
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      onSelectTopic(topic)
      setTopic("")
    }
  }

  const handleScrapeWeb = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate AI agent generating a topic based on web content
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const webTopics = [
        "Climate Change Debate",
        "Space Exploration vs Ocean Discovery",
        "Renewable Energy Revolution",
        "Artificial Intelligence Ethics",
        "Virtual Reality vs Augmented Reality",
        "Cryptocurrency Future",
        "Remote Work vs Office Culture",
        "Social Media Impact",
        "Quantum Computing Applications",
        "Genetic Engineering Possibilities",
      ]

      const generatedTopic = webTopics[Math.floor(Math.random() * webTopics.length)]
      setTopic(generatedTopic)

      // In a real implementation, you would call an AI agent API here
      // const response = await fetch('/api/generate-topic-from-web')
      // const data = await response.json()
      // setTopic(data.topic)
    } catch (err) {
      setError("Failed to generate topic. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative z-10 bg-white border-4 border-black rounded-lg p-6 w-full max-w-md">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 pixel-font">{initialPrompt}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="topic" className="block mb-2 pixel-font text-sm">
              What would you like to battle about?
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Enter a topic for the battle..."
            />
          </div>

          {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <div className="flex flex-col space-y-3">
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors pixel-font"
                disabled={!topic.trim() || isLoading}
              >
                Start Battle
              </button>
              <button
                type="button"
                onClick={() => {
                  // Use a random topic
                  const randomTopics = [
                    "Fire vs Water",
                    "Dragons vs Knights",
                    "Space vs Ocean",
                    "Robots vs Dinosaurs",
                    "Magic vs Technology",
                    "Pizza vs Burgers",
                    "Cats vs Dogs",
                    "Summer vs Winter",
                    "Books vs Movies",
                    "Mountains vs Beaches",
                  ]
                  const randomTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)]
                  setTopic(randomTopic)
                }}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors pixel-font"
                disabled={isLoading}
              >
                Random Topic
              </button>
            </div>

            <button
              type="button"
              onClick={handleScrapeWeb}
              className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors pixel-font flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Scrape Web for Topic
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

