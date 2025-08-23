"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Volume2, VolumeX, Headphones, CheckCircle, AlertCircle } from "lucide-react"
import { toneEngine } from "@/lib/audio-engine"
import { CalibrationManager } from "@/lib/calibration"
import type { CalibrationProfile } from "@/lib/types"

interface CalibrationCardProps {
  onCalibrationComplete: (calibration: CalibrationProfile) => void
}

export function CalibrationCard({ onCalibrationComplete }: CalibrationCardProps) {
  const [deviceLabel, setDeviceLabel] = useState("")
  const [currentStep, setCurrentStep] = useState<"device" | "channels" | "reference" | "adjust">("device")
  const [channelTest, setChannelTest] = useState<{ left: boolean; right: boolean } | null>(null)
  const [referenceVolume, setReferenceVolume] = useState([50])
  const [adjustments, setAdjustments] = useState<Record<number, number>>({})
  const [currentFreq, setCurrentFreq] = useState(1000)
  const [isPlaying, setIsPlaying] = useState(false)

  const testFrequencies = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000]

  const playReferenceSound = async () => {
    if (isPlaying) {
      toneEngine.stopTone()
      setIsPlaying(false)
      return
    }

    setIsPlaying(true)
    try {
      await toneEngine.playTone(1000, 2000, -20 + referenceVolume[0] * 0.6, "Both")
      setTimeout(() => setIsPlaying(false), 2000)
    } catch (error) {
      console.error("Failed to play reference tone:", error)
      setIsPlaying(false)
    }
  }

  const playTestTone = async (frequency: number) => {
    if (isPlaying) {
      toneEngine.stopTone()
      setIsPlaying(false)
      return
    }

    setIsPlaying(true)
    try {
      const adjustment = adjustments[frequency] || 0
      await toneEngine.playTone(frequency, 1000, -20 + referenceVolume[0] * 0.6 + adjustment, "Both")
      setTimeout(() => setIsPlaying(false), 1000)
    } catch (error) {
      console.error("Failed to play test tone:", error)
      setIsPlaying(false)
    }
  }

  const testChannels = async () => {
    try {
      setIsPlaying(true)

      // Test left channel
      await toneEngine.playTone(1000, 800, -15, "Left")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Test right channel
      await toneEngine.playTone(1000, 800, -15, "Right")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setChannelTest({ left: true, right: true })
      setIsPlaying(false)
    } catch (error) {
      console.error("Channel test failed:", error)
      setChannelTest({ left: false, right: false })
      setIsPlaying(false)
    }
  }

  const handleAdjustmentChange = (frequency: number, value: number[]) => {
    setAdjustments((prev) => ({
      ...prev,
      [frequency]: value[0],
    }))
  }

  const completeCalibration = () => {
    const calibration = CalibrationManager.createDefaultCalibration(deviceLabel)

    // Apply adjustments
    calibration.outputGain = (referenceVolume[0] - 50) * 0.6 // Convert slider to dB
    calibration.points = testFrequencies.map((freq) => ({
      freqHz: freq,
      adjustDb: adjustments[freq] || 0,
    }))

    CalibrationManager.saveCalibration(calibration)
    onCalibrationComplete(calibration)
  }

  if (currentStep === "device") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            Device Information
          </CardTitle>
          <CardDescription>Enter your headphone or speaker model for calibration tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="device">Headphone/Speaker Model</Label>
            <Input
              id="device"
              placeholder="e.g., Sony WH-1000XM5, AirPods Pro, Built-in speakers"
              value={deviceLabel}
              onChange={(e) => setDeviceLabel(e.target.value)}
            />
          </div>

          <Button onClick={() => setCurrentStep("channels")} disabled={!deviceLabel.trim()} className="w-full">
            Continue to Channel Test
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "channels") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Left/Right Channel Test</CardTitle>
          <CardDescription>Verify both audio channels are working correctly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              You will hear a tone in the left ear, then the right ear. Confirm both channels are audible.
            </p>

            <Button onClick={testChannels} disabled={isPlaying} size="lg" className="w-full">
              {isPlaying ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Testing Channels...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Test Left/Right Channels
                </>
              )}
            </Button>

            {channelTest && (
              <div className="flex justify-center gap-4">
                <Badge variant={channelTest.left ? "default" : "destructive"}>
                  {channelTest.left ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  Left Channel
                </Badge>
                <Badge variant={channelTest.right ? "default" : "destructive"}>
                  {channelTest.right ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  Right Channel
                </Badge>
              </div>
            )}
          </div>

          {channelTest && channelTest.left && channelTest.right && (
            <Button onClick={() => setCurrentStep("reference")} className="w-full">
              Continue to Volume Reference
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "reference") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Volume Reference</CardTitle>
          <CardDescription>Set a comfortable listening level for the calibration reference</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Adjust the slider until the 1000 Hz tone is at a comfortable, moderate volume. This will be your reference
              level.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reference Volume</Label>
                <Slider
                  value={referenceVolume}
                  onValueChange={setReferenceVolume}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">{referenceVolume[0]}%</div>
              </div>

              <Button
                onClick={playReferenceSound}
                disabled={isPlaying}
                size="lg"
                variant={isPlaying ? "secondary" : "default"}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Stop Reference Tone
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Play Reference Tone (1000 Hz)
                  </>
                )}
              </Button>
            </div>
          </div>

          <Button onClick={() => setCurrentStep("adjust")} className="w-full">
            Continue to Frequency Adjustment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequency Calibration</CardTitle>
        <CardDescription>Fine-tune each frequency to match your reference volume</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-2">
          {testFrequencies.map((freq) => (
            <Button
              key={freq}
              variant={currentFreq === freq ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFreq(freq)}
            >
              {freq < 1000 ? freq : `${freq / 1000}k`} Hz
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <Button onClick={() => playTestTone(currentFreq)} disabled={isPlaying} size="lg">
              {isPlaying ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Stop {currentFreq} Hz
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Play {currentFreq} Hz
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Volume Adjustment for {currentFreq} Hz</Label>
            <Slider
              value={[adjustments[currentFreq] || 0]}
              onValueChange={(value) => handleAdjustmentChange(currentFreq, value)}
              max={20}
              min={-20}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">
              {adjustments[currentFreq] > 0 ? "+" : ""}
              {adjustments[currentFreq] || 0} dB
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Adjust until this frequency matches the volume of your reference tone
          </p>
        </div>

        <Button onClick={completeCalibration} className="w-full" size="lg">
          Complete Calibration
        </Button>
      </CardContent>
    </Card>
  )
}
