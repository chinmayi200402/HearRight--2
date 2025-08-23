"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Ear } from "lucide-react"
import { FREQUENCY_ORDER } from "@/lib/types"

interface TestProgressProps {
  currentEar: "Left" | "Right"
  currentFrequency: number
  completedFrequencies: number[]
  startTime: number
  totalFrequencies?: number
}

export function TestProgress({
  currentEar,
  currentFrequency,
  completedFrequencies,
  startTime,
  totalFrequencies = FREQUENCY_ORDER.length,
}: TestProgressProps) {
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  // Calculate progress based on completed frequencies for both ears
  const totalTests = totalFrequencies * 2 // Both ears
  const completedTests = completedFrequencies.length
  const progressPercent = (completedTests / totalTests) * 100

  const formatFrequency = (freq: number) => {
    return freq >= 1000 ? `${freq / 1000}k` : `${freq}`
  }

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Test Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedTests} of {totalTests} completed
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Current Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Ear className="w-3 h-3" />
            {currentEar} Ear
          </Badge>
          <Badge variant="secondary">{formatFrequency(currentFrequency)} Hz</Badge>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      {/* Frequency Grid */}
      <div className="grid grid-cols-4 gap-1">
        {FREQUENCY_ORDER.map((freq) => {
          const isCompleted = completedFrequencies.includes(freq)
          const isCurrent = freq === currentFrequency

          return (
            <div
              key={freq}
              className={`text-xs p-2 rounded text-center border ${
                isCurrent
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : isCompleted
                    ? "bg-green-100 border-green-300 text-green-700"
                    : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              {formatFrequency(freq)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
