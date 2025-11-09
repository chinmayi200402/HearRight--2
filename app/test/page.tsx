"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TestTube } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { TestController } from "@/components/test-controller"
import type { Session, Threshold } from "@/lib/types"
import { generateUUID } from "@/lib/utils"

export default function TestPage() {
  const router = useRouter()
  const { currentPatient, currentCalibration, setCurrentSession, setTestStartTime, addThreshold, completeSession } =
    useAppStore()

  const [session, setSession] = useState<Session | null>(null)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (!currentPatient || !currentCalibration) {
      router.push("/patient")
      return
    }

    // Initialize session
    const newSession: Session = {
      id: generateUUID(),
      patientId: currentPatient.id,
      calibrationId: currentCalibration.id,
      startedAt: new Date().toISOString(),
      thresholds: [],
    }

    setSession(newSession)
    setCurrentSession(newSession)
    setTestStartTime(startTime)
  }, [currentPatient, currentCalibration, router, setCurrentSession, setTestStartTime, startTime])

  const handleThresholdComplete = (threshold: Threshold) => {
    addThreshold(threshold)
  }

  const handleTestComplete = () => {
    completeSession()
    router.push("/summary")
  }

  if (!currentPatient || !currentCalibration || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Loading test session...</p>
          <Button asChild>
            <Link href="/patient">Return to Start</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/calibration">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold">Hearing Test</h1>
                <p className="text-sm text-slate-600">
                  Testing: {currentPatient.firstName} {currentPatient.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Pure Tone Audiometry</h2>
          <p className="text-slate-600">
            Listen carefully and respond immediately when you hear a tone. The test will automatically progress through
            different frequencies and volumes for each ear.
          </p>
        </div>

        <TestController
          calibration={currentCalibration}
          onThresholdComplete={handleThresholdComplete}
          onTestComplete={handleTestComplete}
          startTime={startTime}
        />
      </main>
    </div>
  )
}
