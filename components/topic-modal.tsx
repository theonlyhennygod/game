"use client"

import type React from "react"

import { useState } from "react"
import { X, Globe } from "lucide-react"

interface TopicModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTopic: (topic: string, backgroundUrl?: string) => void
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
  const [description, setDescription] = useState("")
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
<<<<<<< HEAD
    if (!topic.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const bgResponse = await fetch('/api/openai', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          prompt: `Isometric pixel art battle arena for "${topic}", vibrant colors, 16-bit RPG style`,
          count: 1
        }),
      })

      // Handle non-JSON responses
      const contentType = bgResponse.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error(`Unexpected response format: ${contentType}`)
      }

      const bgData = await bgResponse.json()
      
      if (!bgResponse.ok) {
        throw new Error(bgData.error || 'Failed to generate arena')
      }

      if (!bgData.imageUrls?.[0]?.startsWith('https://')) {
        throw new Error('Invalid image URL format received from API')
      }

      console.log('Generated background URL:', bgData.imageUrls[0]);

      console.log('Generation metadata:', {
        prompt: `Isometric pixel art battle arena for "${topic}"`,
        responseStatus: bgResponse.status,
        imageUrl: bgData.imageUrls?.[0],
        error: bgData.error
      });

      onSelectTopic(topic, bgData.imageUrls[0])
      setTopic("")
      onClose()

    } catch (error: any) {
      console.error('Arena Generation Failed:', {
        error: error.message,
        stack: error.stack,
        cause: error.cause
      })
      setError(error.message || "Failed to generate battle arena")
    } finally {
      setIsLoading(false)
=======
    if (topic.trim()) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/generate_image?topic=${encodeURIComponent(topic)}`);
        const result = await response.json();
  
        if (response.ok) {
          onSelectTopic(result.result);  // Pass result to parent or handle locally
        } else {
          onSelectTopic(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        onSelectTopic('Error fetching data.');
      } finally {
        setTopic("");         // Clear input field
      }
>>>>>>> f8d467b0c65614f6d98d0d214cc657202763db62
    }
  }

  const handleScrapeWeb = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const url = topic.trim()
      
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze webpage')
      }

      const data = await response.json()
      
      // Directly set the scraped topic into the textarea
      setTopic(data.topic || "Could not generate topic")

    } catch (err) {
      setError("Failed to generate topic. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRandomTopic = async () => {
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
    
    // Generate description
    setIsGeneratingDesc(true)
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ topic: randomTopic })
      })
      
      const data = await response.json()
      setDescription(data.description || "No description generated")
    } catch (err) {
      setDescription("Failed to generate description")
    } finally {
      setIsGeneratingDesc(false)
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
              Enter URL or topic:
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
<<<<<<< HEAD
              className="w-full p-3 border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none text-black bg-white"
=======
              className="w-full p-3 border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none text-black"
>>>>>>> f8d467b0c65614f6d98d0d214cc657202763db62
              rows={3}
              placeholder="Enter a topic for the battle..."
              disabled={isLoading}
            />
          </div>

          {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          {isLoading && (
            <div className="mb-4 p-2 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              Generating arena image for: "{topic}"
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors pixel-font"
                disabled={!topic.trim() || isLoading}
              >
                {isLoading ? 'Generating Arena...' : 'Generate Arena'}
              </button>
              <button
                type="button"
                onClick={handleRandomTopic}
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

