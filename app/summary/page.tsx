"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Share, Download, Printer } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { AudiogramChart } from "@/components/audiogram-chart"
import { HearingSummary } from "@/components/hearing-summary"
import { thresholdsToAudiogramData, calculatePTA } from "@/lib/audiogram-utils"
import { PDFReportGenerator } from "@/lib/pdf-generator"
import type { AudiogramData, Threshold } from "@/lib/types"

export default function SummaryPage() {
  const router = useRouter()
  const { currentPatient, currentSession, updateSessionThresholds, testerName } = useAppStore()
  const [audiogramData, setAudiogramData] = useState<AudiogramData[]>([])
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    if (!currentPatient || !currentSession) {
      router.push("/patient")
      return
    }

    // Convert thresholds to audiogram data
    const data = thresholdsToAudiogramData(currentSession.thresholds)
    setAudiogramData(data)
  }, [currentPatient, currentSession, router])

  const handleAudiogramDataChange = (newData: AudiogramData[]) => {
    setAudiogramData(newData)

    // Convert back to thresholds and update session
    const newThresholds: Threshold[] = []

    newData.forEach((item) => {
      if (item.rightEar !== undefined) {
        newThresholds.push({
          ear: "Right",
          freqHz: item.frequency,
          thresholdDb: item.rightEar,
          trials: [{ levelDb: item.rightEar, heard: true, timestamp: Date.now() }], // Simplified for manual edits
        })
      }
      if (item.leftEar !== undefined) {
        newThresholds.push({
          ear: "Left",
          freqHz: item.frequency,
          thresholdDb: item.leftEar,
          trials: [{ levelDb: item.leftEar, heard: true, timestamp: Date.now() }], // Simplified for manual edits
        })
      }
    })

    updateSessionThresholds(newThresholds)
  }

  const handleGenerateReport = async () => {
    if (!currentPatient || !currentSession) return

    setIsGeneratingPDF(true)
    try {
      await PDFReportGenerator.downloadPDF({
        patient: currentPatient,
        session: currentSession,
        testerName: testerName || undefined,
      })
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      alert("Failed to generate PDF report. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handlePrintReport = async () => {
    if (!currentPatient || !currentSession) return

    try {
      await PDFReportGenerator.printPDF({
        patient: currentPatient,
        session: currentSession,
        testerName: testerName || undefined,
      })
    } catch (error) {
      console.error("Failed to print PDF:", error)
      alert("Failed to print report. Please try again.")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hearing Test Results - ${currentPatient?.firstName} ${currentPatient?.lastName}`,
          text: "Hearing test results from HearRight",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (!currentPatient || !currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No test session found...</p>
          <Button asChild>
            <Link href="/patient">Start New Test</Link>
          </Button>
        </div>
      </div>
    )
  }

  const rightPTA = calculatePTA(currentSession.thresholds, "Right")
  const leftPTA = calculatePTA(currentSession.thresholds, "Left")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/test">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Test
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Test Results</h1>
                <p className="text-sm text-slate-600">
                  {currentPatient.firstName} {currentPatient.lastName} •{" "}
                  {new Date(currentSession.startedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button onClick={handlePrintReport} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              <Button onClick={handleGenerateReport} disabled={isGeneratingPDF} size="sm">
                <FileText className="w-4 h-4 mr-1" />
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Quick Results */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-lg mb-2">Right Ear PTA</h3>
              <div className="text-3xl font-bold text-slate-900">{rightPTA.pta} dB</div>
              <div className="text-sm text-slate-600">{rightPTA.interpretation}</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-lg mb-2">Left Ear PTA</h3>
              <div className="text-3xl font-bold text-slate-900">{leftPTA.pta} dB</div>
              <div className="text-sm text-slate-600">{leftPTA.interpretation}</div>
            </div>
          </div>

          {/* Audiogram */}
          <AudiogramChart
            data={audiogramData}
            title="Pure Tone Audiogram"
            editable={true}
            onDataChange={handleAudiogramDataChange}
          />

          {/* Detailed Summary */}
          <HearingSummary thresholds={currentSession.thresholds} testDuration={currentSession.durationSec} />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleGenerateReport} disabled={isGeneratingPDF} size="lg" className="flex-1 sm:flex-none">
              <Download className="w-5 h-5 mr-2" />
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF Report"}
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none bg-transparent">
              <Link href="/reports">
                <FileText className="w-5 h-5 mr-2" />
                View All Reports
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none bg-transparent">
              <Link href="/">Start New Test</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
