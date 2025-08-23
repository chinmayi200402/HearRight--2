"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ear, Clock, TrendingUp } from "lucide-react"
import type { Threshold } from "@/lib/types"
import { calculatePTA, getHearingLossColor, getHearingLossDescription, formatFrequency } from "@/lib/audiogram-utils"

interface HearingSummaryProps {
  thresholds: Threshold[]
  testDuration?: number
  className?: string
}

export function HearingSummary({ thresholds, testDuration, className }: HearingSummaryProps) {
  const rightPTA = calculatePTA(thresholds, "Right")
  const leftPTA = calculatePTA(thresholds, "Left")

  const rightThresholds = thresholds.filter((t) => t.ear === "Right")
  const leftThresholds = thresholds.filter((t) => t.ear === "Left")

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTimeSaved = (actualSeconds?: number) => {
    if (!actualSeconds) return null
    const baselineMinutes = 20 // Reference baseline
    const actualMinutes = actualSeconds / 60
    const percentSaved = Math.max(0, Math.round(((baselineMinutes - actualMinutes) / baselineMinutes) * 100))
    return percentSaved
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Test Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Test Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{formatDuration(testDuration)}</div>
              <div className="text-sm text-slate-600">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{thresholds.length}</div>
              <div className="text-sm text-slate-600">Frequencies Tested</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {thresholds.reduce((sum, t) => sum + t.trials.length, 0)}
              </div>
              <div className="text-sm text-slate-600">Total Trials</div>
            </div>
            {getTimeSaved(testDuration) && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{getTimeSaved(testDuration)}%</div>
                <div className="text-sm text-slate-600">Time Saved</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PTA Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Right Ear */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ear className="w-5 h-5 text-red-600" />
              Right Ear
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{rightPTA.pta} dB</div>
              <div className="text-sm text-slate-600">Pure Tone Average</div>
            </div>

            <div className="text-center">
              <Badge className={`${getHearingLossColor(rightPTA.interpretation)} bg-transparent border-current`}>
                {rightPTA.interpretation}
              </Badge>
              <p className="text-sm text-slate-600 mt-2">{getHearingLossDescription(rightPTA.interpretation)}</p>
            </div>

            {/* Individual thresholds */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Thresholds by Frequency:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {rightThresholds
                  .sort((a, b) => a.freqHz - b.freqHz)
                  .map((threshold) => (
                    <div key={threshold.freqHz} className="flex justify-between">
                      <span>{formatFrequency(threshold.freqHz)} Hz:</span>
                      <span className="font-medium">{threshold.thresholdDb} dB</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Left Ear */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ear className="w-5 h-5 text-blue-600" />
              Left Ear
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{leftPTA.pta} dB</div>
              <div className="text-sm text-slate-600">Pure Tone Average</div>
            </div>

            <div className="text-center">
              <Badge className={`${getHearingLossColor(leftPTA.interpretation)} bg-transparent border-current`}>
                {leftPTA.interpretation}
              </Badge>
              <p className="text-sm text-slate-600 mt-2">{getHearingLossDescription(leftPTA.interpretation)}</p>
            </div>

            {/* Individual thresholds */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Thresholds by Frequency:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {leftThresholds
                  .sort((a, b) => a.freqHz - b.freqHz)
                  .map((threshold) => (
                    <div key={threshold.freqHz} className="flex justify-between">
                      <span>{formatFrequency(threshold.freqHz)} Hz:</span>
                      <span className="font-medium">{threshold.thresholdDb} dB</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Clinical Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Method:</strong> Pure-tone air-conduction screening using down-10/up-5 staircase methodology
              (Hughson-Westlake procedure).
            </div>
            <div>
              <strong>Test Environment:</strong> Self-administered screening in user-controlled environment with
              calibrated audio output.
            </div>
            <div>
              <strong>Reliability:</strong> Thresholds determined by lowest level with 2/3 positive responses on
              ascending trials.
            </div>
            {(rightPTA.interpretation !== "Normal" || leftPTA.interpretation !== "Normal") && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <strong className="text-amber-800">Recommendation:</strong>
                <span className="text-amber-700 ml-1">
                  Results suggest possible hearing loss. Clinical audiological evaluation recommended for comprehensive
                  assessment and treatment planning.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
