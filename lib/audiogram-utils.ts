import type { Threshold, HearingLossLevel } from "./types"
import { HEARING_LOSS_RANGES } from "./types"

export interface AudiogramData {
  frequency: number
  rightEar?: number
  leftEar?: number
}

export interface PTAResult {
  pta: number
  interpretation: HearingLossLevel
}

export function calculatePTA(thresholds: Threshold[], ear: "Left" | "Right"): PTAResult {
  // PTA is average of 500, 1000, and 2000 Hz
  const ptaFrequencies = [500, 1000, 2000]
  const earThresholds = thresholds.filter((t) => t.ear === ear)

  const ptaValues = ptaFrequencies
    .map((freq) => {
      const threshold = earThresholds.find((t) => t.freqHz === freq)
      return threshold?.thresholdDb
    })
    .filter((value): value is number => value !== undefined)

  if (ptaValues.length === 0) {
    return { pta: 0, interpretation: "Normal" }
  }

  const pta = ptaValues.reduce((sum, value) => sum + value, 0) / ptaValues.length

  // Determine hearing loss level
  let interpretation: HearingLossLevel = "Normal"
  for (const [level, range] of Object.entries(HEARING_LOSS_RANGES)) {
    if (pta >= range.min && pta <= range.max) {
      interpretation = level as HearingLossLevel
      break
    }
  }

  return { pta: Math.round(pta), interpretation }
}

export function thresholdsToAudiogramData(thresholds: Threshold[]): AudiogramData[] {
  const frequencies = [...new Set(thresholds.map((t) => t.freqHz))].sort((a, b) => a - b)

  return frequencies.map((frequency) => {
    const rightThreshold = thresholds.find((t) => t.freqHz === frequency && t.ear === "Right")
    const leftThreshold = thresholds.find((t) => t.freqHz === frequency && t.ear === "Left")

    return {
      frequency,
      rightEar: rightThreshold?.thresholdDb,
      leftEar: leftThreshold?.thresholdDb,
    }
  })
}

export function getHearingLossColor(level: HearingLossLevel): string {
  switch (level) {
    case "Normal":
      return "text-green-600"
    case "Mild":
      return "text-yellow-600"
    case "Moderate":
      return "text-orange-600"
    case "Moderately Severe":
      return "text-red-600"
    case "Severe":
      return "text-red-700"
    case "Profound":
      return "text-red-900"
    default:
      return "text-gray-600"
  }
}

export function getHearingLossDescription(level: HearingLossLevel): string {
  switch (level) {
    case "Normal":
      return "No significant hearing loss detected"
    case "Mild":
      return "Slight difficulty with soft sounds"
    case "Moderate":
      return "Difficulty with normal conversation"
    case "Moderately Severe":
      return "Significant difficulty with speech"
    case "Severe":
      return "Profound difficulty with most sounds"
    case "Profound":
      return "Little to no hearing ability"
    default:
      return "Unable to determine hearing status"
  }
}

export function formatFrequency(freq: number): string {
  return freq >= 1000 ? `${freq / 1000}k` : `${freq}`
}
