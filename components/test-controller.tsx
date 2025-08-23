"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResponsePad } from "./response-pad"
import { TestProgress } from "./test-progress"
import { HughsonWestlakeStaircase } from "@/lib/hughson-westlake"
import { toneEngine } from "@/lib/audio-engine"
import { CalibrationManager } from "@/lib/calibration"
import { FREQUENCY_ORDER } from "@/lib/types"
import type { CalibrationProfile, Threshold } from "@/lib/types"
import { Play, Pause, SkipForward } from "lucide-react"

interface TestControllerProps {
  calibration: CalibrationProfile
  onThresholdComplete: (threshold: Threshold) => void
  onTestComplete: () => void
  startTime: number
}

export function TestController({ calibration, onThresholdComplete, onTestComplete, startTime }: TestControllerProps) {
  const [currentEar, setCurrentEar] = useState<"Left" | "Right">("Right")
  const [currentFreqIndex, setCurrentFreqIndex] = useState(0)
  const [staircase, setStaircase] = useState(() => new HughsonWestlakeStaircase())
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [completedThresholds, setCompletedThresholds] = useState<Threshold[]>([])

  const currentFrequency = FREQUENCY_ORDER[currentFreqIndex]
  const totalFrequencies = FREQUENCY_ORDER.length * 2 // Both ears

  const playTone = useCallback(async () => {
    if (isPaused) return

    setIsPlaying(true)

    try {
      const currentLevel = staircase.getCurrentLevel()
      const calibratedLevel = CalibrationManager.applyCalibration(currentLevel, currentFrequency, calibration)

      await toneEngine.playTone(currentFrequency, 500, calibratedLevel, currentEar)

      setTimeout(() => {
        setIsPlaying(false)
      }, 500)
    } catch (error) {
      console.error("Failed to play tone:", error)
      setIsPlaying(false)
    }
  }, [staircase, currentFrequency, currentEar, calibration, isPaused])

  const handleResponse = useCallback(
    (heard: boolean) => {
      if (isPlaying || isPaused) return

      staircase.addResponse(heard)

      if (staircase.isComplete()) {
        const threshold = staircase.getThreshold()
        if (threshold !== undefined) {
          const thresholdData: Threshold = {
            ear: currentEar,
            freqHz: currentFrequency,
            thresholdDb: threshold,
            trials: staircase.getTrials(),
          }

          setCompletedThresholds((prev) => [...prev, thresholdData])
          onThresholdComplete(thresholdData)
        }

        // Move to next frequency or ear
        if (currentFreqIndex < FREQUENCY_ORDER.length - 1) {
          setCurrentFreqIndex((prev) => prev + 1)
          setStaircase(new HughsonWestlakeStaircase())
        } else if (currentEar === "Right") {
          setCurrentEar("Left")
          setCurrentFreqIndex(0)
          setStaircase(new HughsonWestlakeStaircase())
        } else {
          onTestComplete()
          return
        }
      }

      setTimeout(() => {
        if (!isPaused) {
          playTone()
        }
      }, 800)
    },
    [
      staircase,
      currentEar,
      currentFrequency,
      currentFreqIndex,
      onThresholdComplete,
      onTestComplete,
      playTone,
      isPlaying,
      isPaused,
    ],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      playTone()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handlePause = () => {
    setIsPaused(!isPaused)
    if (isPlaying) {
      toneEngine.stopTone()
      setIsPlaying(false)
    }
  }

  const handleManualPlay = () => {
    if (!isPlaying && !isPaused) {
      playTone()
    }
  }

  const handleSkip = () => {
    const threshold: Threshold = {
      ear: currentEar,
      freqHz: currentFrequency,
      thresholdDb: 100,
      trials: [{ levelDb: 100, heard: false, timestamp: Date.now() }],
    }

    setCompletedThresholds((prev) => [...prev, threshold])
    onThresholdComplete(threshold)

    if (currentFreqIndex < FREQUENCY_ORDER.length - 1) {
      setCurrentFreqIndex((prev) => prev + 1)
      setStaircase(new HughsonWestlakeStaircase())
    } else if (currentEar === "Right") {
      setCurrentEar("Left")
      setCurrentFreqIndex(0)
      setStaircase(new HughsonWestlakeStaircase())
    } else {
      onTestComplete()
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <TestProgress
        currentEar={currentEar}
        currentFrequency={currentFrequency}
        completedFrequencies={completedThresholds.map((t) => t.freqHz)}
        startTime={startTime}
      />

      {/* Current Test Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Testing {currentEar} Ear</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {currentFrequency >= 1000 ? `${currentFrequency / 1000}k` : currentFrequency} Hz
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Current Level: {staircase.getCurrentLevel()} dB</p>
            <p className="text-sm text-muted-foreground">Trials: {staircase.getTrials().length}</p>
            <p className="text-xs text-blue-600 font-medium">
              ~{Math.max(0, Math.ceil((8 - completedThresholds.length) * 15))}s remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Response Pad */}
      <ResponsePad
        onResponse={handleResponse}
        isPlaying={isPlaying}
        disabled={isPaused}
        showInstructions={completedThresholds.length === 0}
      />

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <Button onClick={handlePause} variant="outline" size="sm">
          {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
          {isPaused ? "Resume" : "Pause"}
        </Button>

        <Button onClick={handleManualPlay} variant="outline" size="sm" disabled={isPlaying || isPaused}>
          <Play className="w-4 h-4 mr-1" />
          Replay Tone
        </Button>

        <Button onClick={handleSkip} variant="outline" size="sm" disabled={isPlaying}>
          <SkipForward className="w-4 h-4 mr-1" />
          Skip Frequency
        </Button>
      </div>

      {isPaused && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <p className="text-center text-amber-800 text-sm">Test paused. Click Resume to continue.</p>
          </CardContent>
        </Card>
      )}

      {currentEar === "Left" && currentFreqIndex === 0 && completedThresholds.length === 4 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="py-4">
            <p className="text-center text-green-800 text-sm font-medium">
              ✓ Right ear complete! Now testing left ear...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
