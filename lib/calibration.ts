import type { CalibrationProfile, TestFrequency } from "./types"

export class CalibrationManager {
  private static readonly STORAGE_KEY = "hearright-calibrations"

  static saveCalibration(profile: CalibrationProfile): void {
    const existing = this.getCalibrations()
    const updated = existing.filter((p) => p.id !== profile.id)
    updated.push(profile)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
  }

  static getCalibrations(): CalibrationProfile[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Failed to load calibrations:", error)
      return []
    }
  }

  static getCalibration(id: string): CalibrationProfile | null {
    return this.getCalibrations().find((p) => p.id === id) || null
  }

  static deleteCalibration(id: string): void {
    const existing = this.getCalibrations()
    const filtered = existing.filter((p) => p.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
  }

  static createDefaultCalibration(deviceLabel: string): CalibrationProfile {
    const defaultFrequencies: TestFrequency[] = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000]

    return {
      id: crypto.randomUUID(),
      deviceLabel,
      createdAt: new Date().toISOString(),
      points: defaultFrequencies.map((freq) => ({
        freqHz: freq,
        adjustDb: 0, // Start with no adjustment
      })),
      outputGain: 0, // Start with no master gain adjustment
    }
  }

  static applyCalibration(baseVolumeDb: number, frequency: number, calibration: CalibrationProfile | null): number {
    if (!calibration) return baseVolumeDb

    // Find the calibration point for this frequency
    const point = calibration.points.find((p) => p.freqHz === frequency)
    const frequencyAdjust = point?.adjustDb || 0

    return baseVolumeDb + calibration.outputGain + frequencyAdjust
  }

  static interpolateCalibration(frequency: number, calibration: CalibrationProfile): number {
    const points = calibration.points.sort((a, b) => a.freqHz - b.freqHz)

    // Find surrounding points
    let lowerPoint = points[0]
    let upperPoint = points[points.length - 1]

    for (let i = 0; i < points.length - 1; i++) {
      if (points[i].freqHz <= frequency && points[i + 1].freqHz >= frequency) {
        lowerPoint = points[i]
        upperPoint = points[i + 1]
        break
      }
    }

    // Linear interpolation
    if (lowerPoint.freqHz === upperPoint.freqHz) {
      return lowerPoint.adjustDb
    }

    const ratio = (frequency - lowerPoint.freqHz) / (upperPoint.freqHz - lowerPoint.freqHz)
    return lowerPoint.adjustDb + ratio * (upperPoint.adjustDb - lowerPoint.adjustDb)
  }
}
