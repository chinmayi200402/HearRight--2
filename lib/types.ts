export type Patient = {
  id: string // uuid
  firstName: string
  lastName: string
  dob: string // ISO date
  sex?: "Male" | "Female" | "Other" | "Prefer not to say"
  patientId?: string // external MRN
  notes?: string
  createdAt: string
}

export type CalibrationPoint = {
  freqHz: number
  adjustDb: number
}

export type CalibrationProfile = {
  id: string // uuid
  deviceLabel: string // e.g., "Sony WH-1000XM5"
  createdAt: string
  points: CalibrationPoint[] // per frequency adjustment
  outputGain: number // master trim
}

export type Threshold = {
  ear: "Left" | "Right"
  freqHz: number
  thresholdDb: number // relative dB SPL
  trials: { levelDb: number; heard: boolean }[] // history for audit
}

export type Session = {
  id: string // uuid
  patientId: string
  calibrationId: string
  startedAt: string
  completedAt?: string
  thresholds: Threshold[]
  ptaLeft?: number
  ptaRight?: number
  interpretationLeft?: string
  interpretationRight?: string
  environmentNotes?: string // noise level estimate, headphones used
  durationSec?: number
  testerName?: string
}

export type HearingLossLevel = "Normal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe" | "Profound"

export type TestFrequency = 125 | 250 | 500 | 1000 | 2000 | 3000 | 4000 | 6000 | 8000 | 12000

export const DEFAULT_FREQUENCIES: TestFrequency[] = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000]
export const FREQUENCY_ORDER: TestFrequency[] = [1000, 2000, 4000, 500] // Essential frequencies only

export const HEARING_LOSS_RANGES = {
  Normal: { min: 0, max: 25 },
  Mild: { min: 26, max: 40 },
  Moderate: { min: 41, max: 55 },
  "Moderately Severe": { min: 56, max: 70 },
  Severe: { min: 71, max: 90 },
  Profound: { min: 91, max: 120 },
} as const
