import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Patient, Session, CalibrationProfile, Threshold } from "./types"
import { StorageManager } from "./storage"

interface AppState {
  // Current test session
  currentPatient: Patient | null
  currentSession: Session | null
  currentCalibration: CalibrationProfile | null

  // Test state
  currentEar: "Left" | "Right"
  currentFrequency: number
  currentLevel: number
  testStartTime: number | null

  // Settings
  cloudSyncEnabled: boolean
  testerName: string

  // Actions
  setCurrentPatient: (patient: Patient | null) => void
  setCurrentSession: (session: Session | null) => void
  setCurrentCalibration: (calibration: CalibrationProfile | null) => void
  setCurrentEar: (ear: "Left" | "Right") => void
  setCurrentFrequency: (frequency: number) => void
  setCurrentLevel: (level: number) => void
  setTestStartTime: (time: number | null) => void
  setCloudSyncEnabled: (enabled: boolean) => void
  setTesterName: (name: string) => void

  // Test actions
  addThreshold: (threshold: Threshold) => void
  updateSessionThresholds: (thresholds: Threshold[]) => void
  completeSession: () => void
  resetTest: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPatient: null,
      currentSession: null,
      currentCalibration: null,
      currentEar: "Right",
      currentFrequency: 1000,
      currentLevel: 30,
      testStartTime: null,
      cloudSyncEnabled: false,
      testerName: "",

      // Actions
      setCurrentPatient: async (patient) => {
        set({ currentPatient: patient })
        if (patient) {
          await StorageManager.savePatient(patient)
        }
      },

      setCurrentSession: async (session) => {
        set({ currentSession: session })
        if (session) {
          await StorageManager.saveSession(session)
        }
      },

      setCurrentCalibration: async (calibration) => {
        set({ currentCalibration: calibration })
        if (calibration) {
          await StorageManager.saveCalibration(calibration)
        }
      },

      setCurrentEar: (ear) => set({ currentEar: ear }),
      setCurrentFrequency: (frequency) => set({ currentFrequency: frequency }),
      setCurrentLevel: (level) => set({ currentLevel: level }),
      setTestStartTime: (time) => set({ testStartTime: time }),
      setCloudSyncEnabled: (enabled) => set({ cloudSyncEnabled: enabled }),
      setTesterName: (name) => set({ testerName: name }),

      // Test actions
      addThreshold: (threshold) => {
        const { currentSession } = get()
        if (currentSession) {
          const updatedThresholds = [...currentSession.thresholds, threshold]
          set({
            currentSession: {
              ...currentSession,
              thresholds: updatedThresholds,
            },
          })
        }
      },

      updateSessionThresholds: (thresholds) => {
        const { currentSession } = get()
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              thresholds,
            },
          })
        }
      },

      completeSession: async () => {
        const { currentSession } = get()
        if (currentSession) {
          const completedSession = {
            ...currentSession,
            completedAt: new Date().toISOString(),
            durationSec: get().testStartTime ? Math.floor((Date.now() - get().testStartTime!) / 1000) : undefined,
          }
          set({ currentSession: completedSession })
          await StorageManager.saveSession(completedSession)
        }
      },

      resetTest: () =>
        set({
          currentPatient: null,
          currentSession: null,
          currentEar: "Right",
          currentFrequency: 1000,
          currentLevel: 30,
          testStartTime: null,
        }),
    }),
    {
      name: "hearright-store",
      partialize: (state) => ({
        cloudSyncEnabled: state.cloudSyncEnabled,
        testerName: state.testerName,
      }),
    },
  ),
)
