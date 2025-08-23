"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { CalibrationCard } from "@/components/calibration-card"
import type { CalibrationProfile } from "@/lib/types"

export default function CalibrationPage() {
  const router = useRouter()
  const { currentPatient, setCurrentCalibration } = useAppStore()

  const handleCalibrationComplete = (calibration: CalibrationProfile) => {
    setCurrentCalibration(calibration)
    router.push("/test")
  }

  if (!currentPatient) {
    router.push("/patient")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/onboarding">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold">Device Calibration</h1>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Calibrate Your Audio Device</h2>
          <p className="text-slate-600">
            This process ensures accurate hearing measurements by calibrating your specific headphones or speakers. It
            takes about 3-4 minutes to complete.
          </p>
        </div>

        <CalibrationCard onCalibrationComplete={handleCalibrationComplete} />
      </main>
    </div>
  )
}
