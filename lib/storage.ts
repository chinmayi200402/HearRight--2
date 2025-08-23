import Dexie, { type EntityTable } from "dexie"
import type { Patient, Session, CalibrationProfile } from "./types"

export interface StoredSession extends Session {
  patient?: Patient
  calibration?: CalibrationProfile
}

export class HearRightDB extends Dexie {
  patients!: EntityTable<Patient, "id">
  sessions!: EntityTable<Session, "id">
  calibrations!: EntityTable<CalibrationProfile, "id">

  constructor() {
    super("HearRightDB")

    this.version(1).stores({
      patients: "id, firstName, lastName, dob, createdAt",
      sessions: "id, patientId, startedAt, completedAt",
      calibrations: "id, deviceLabel, createdAt",
    })
  }
}

export const db = new HearRightDB()

export class StorageManager {
  static async getOfflineStatus(): Promise<{
    isOnline: boolean
    pendingSyncs: number
    lastSyncTime?: string
  }> {
    const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true
    const lastSyncTime = localStorage.getItem("hearright-last-sync")

    return {
      isOnline,
      pendingSyncs: 0, // Could track pending syncs to cloud storage
      lastSyncTime: lastSyncTime || undefined,
    }
  }

  static async markSyncTime(): Promise<void> {
    localStorage.setItem("hearright-last-sync", new Date().toISOString())
  }

  // Patient operations
  static async savePatient(patient: Patient): Promise<void> {
    await db.patients.put(patient)
  }

  static async getPatient(id: string): Promise<Patient | undefined> {
    return await db.patients.get(id)
  }

  static async getAllPatients(): Promise<Patient[]> {
    return await db.patients.orderBy("createdAt").reverse().toArray()
  }

  static async deletePatient(id: string): Promise<void> {
    await db.patients.delete(id)
    // Also delete associated sessions
    const sessions = await db.sessions.where("patientId").equals(id).toArray()
    await Promise.all(sessions.map((session) => db.sessions.delete(session.id)))
  }

  // Session operations
  static async saveSession(session: Session): Promise<void> {
    await db.sessions.put(session)
  }

  static async getSession(id: string): Promise<StoredSession | undefined> {
    const session = await db.sessions.get(id)
    if (!session) return undefined

    const patient = await db.patients.get(session.patientId)
    const calibration = await db.calibrations.get(session.calibrationId)

    return {
      ...session,
      patient,
      calibration,
    }
  }

  static async getAllSessions(): Promise<StoredSession[]> {
    const sessions = await db.sessions.orderBy("startedAt").reverse().toArray()

    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        const patient = await db.patients.get(session.patientId)
        const calibration = await db.calibrations.get(session.calibrationId)
        return {
          ...session,
          patient,
          calibration,
        }
      }),
    )

    return sessionsWithDetails
  }

  static async getSessionsByPatient(patientId: string): Promise<StoredSession[]> {
    const sessions = await db.sessions.where("patientId").equals(patientId).reverse().sortBy("startedAt")

    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        const patient = await db.patients.get(session.patientId)
        const calibration = await db.calibrations.get(session.calibrationId)
        return {
          ...session,
          patient,
          calibration,
        }
      }),
    )

    return sessionsWithDetails
  }

  static async deleteSession(id: string): Promise<void> {
    await db.sessions.delete(id)
  }

  // Calibration operations
  static async saveCalibration(calibration: CalibrationProfile): Promise<void> {
    await db.calibrations.put(calibration)
  }

  static async getCalibration(id: string): Promise<CalibrationProfile | undefined> {
    return await db.calibrations.get(id)
  }

  static async getAllCalibrations(): Promise<CalibrationProfile[]> {
    return await db.calibrations.orderBy("createdAt").reverse().toArray()
  }

  static async deleteCalibration(id: string): Promise<void> {
    await db.calibrations.delete(id)
  }

  // Search and filter operations
  static async searchSessions(query: string): Promise<StoredSession[]> {
    const allSessions = await this.getAllSessions()

    if (!query.trim()) return allSessions

    const searchTerm = query.toLowerCase()

    return allSessions.filter((session) => {
      const patient = session.patient
      if (!patient) return false

      return (
        patient.firstName.toLowerCase().includes(searchTerm) ||
        patient.lastName.toLowerCase().includes(searchTerm) ||
        patient.patientId?.toLowerCase().includes(searchTerm) ||
        new Date(session.startedAt).toLocaleDateString().includes(searchTerm)
      )
    })
  }

  static async getSessionsInDateRange(startDate: Date, endDate: Date): Promise<StoredSession[]> {
    const sessions = await db.sessions
      .where("startedAt")
      .between(startDate.toISOString(), endDate.toISOString())
      .reverse()
      .sortBy("startedAt")

    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        const patient = await db.patients.get(session.patientId)
        const calibration = await db.calibrations.get(session.calibrationId)
        return {
          ...session,
          patient,
          calibration,
        }
      }),
    )

    return sessionsWithDetails
  }

  // Export data
  static async exportAllData(): Promise<{
    patients: Patient[]
    sessions: Session[]
    calibrations: CalibrationProfile[]
  }> {
    const [patients, sessions, calibrations] = await Promise.all([
      db.patients.toArray(),
      db.sessions.toArray(),
      db.calibrations.toArray(),
    ])

    return { patients, sessions, calibrations }
  }

  // Import data
  static async importData(data: {
    patients?: Patient[]
    sessions?: Session[]
    calibrations?: CalibrationProfile[]
  }): Promise<void> {
    if (data.patients) {
      await db.patients.bulkPut(data.patients)
    }
    if (data.sessions) {
      await db.sessions.bulkPut(data.sessions)
    }
    if (data.calibrations) {
      await db.calibrations.bulkPut(data.calibrations)
    }
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    await Promise.all([db.patients.clear(), db.sessions.clear(), db.calibrations.clear()])
  }
}
