"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, VolumeX } from "lucide-react"

interface ResponsePadProps {
  onResponse: (heard: boolean) => void
  isPlaying: boolean
  disabled?: boolean
  showInstructions?: boolean
}

export function ResponsePad({ onResponse, isPlaying, disabled = false, showInstructions = true }: ResponsePadProps) {
  const [lastResponse, setLastResponse] = useState<boolean | null>(null)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (disabled || isPlaying) return

      switch (event.key.toLowerCase()) {
        case "h":
        case " ":
          event.preventDefault()
          handleResponse(true)
          break
        case "n":
          event.preventDefault()
          handleResponse(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [disabled, isPlaying])

  const handleResponse = (heard: boolean) => {
    if (disabled || isPlaying) return

    setLastResponse(heard)
    onResponse(heard)

    // Clear the visual feedback after a short delay
    setTimeout(() => setLastResponse(null), 1000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        {showInstructions && (
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-2">Press when you hear a tone, even if it's very quiet</p>
            <p className="text-xs text-muted-foreground">Keyboard: H = Heard, N = Not Heard, Space = Heard</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleResponse(true)}
            disabled={disabled || isPlaying}
            size="lg"
            className={`h-20 text-lg font-semibold transition-all ${
              lastResponse === true ? "bg-green-600 hover:bg-green-700 scale-95" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <Volume2 className="w-6 h-6 mr-2" />
            Heard
          </Button>

          <Button
            onClick={() => handleResponse(false)}
            disabled={disabled || isPlaying}
            size="lg"
            variant="destructive"
            className={`h-20 text-lg font-semibold transition-all ${lastResponse === false ? "scale-95" : ""}`}
          >
            <VolumeX className="w-6 h-6 mr-2" />
            Not Heard
          </Button>
        </div>

        {isPlaying && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Playing tone...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
