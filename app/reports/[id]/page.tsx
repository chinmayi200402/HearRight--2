"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Share, Download, Trash2, Printer } from "lucide-react"
import Link from "next/link"
import { AudiogramChart } from "@/components/audiogram-chart"
import { HearingSummary } from "@/components/hearing-summary"
import { StorageManager, type StoredSession } from "@/lib/storage"
import { thresholdsToAudiogramData } from "@/lib/audiogram-utils"
import { PDFReportGenerator } from "@/lib/pdf-generator"
import { useAppStore } from "@/lib/store"

interface ReportDetailPageProps {
  params: { id: string }
}

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  const router = useRouter()
  const { testerName } = useAppStore()
  const [session, setSession] = useState<StoredSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    loadSession()
  }, [params.id])

  const loadSession = async () => {
    try {
      const sessionData = await StorageManager.getSession(params.id)
      setSession(sessionData || null)
    } catch (error) {
      console.error("Failed to load session:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!session?.patient) return

    const confirmed = confirm(
      `Delete test results for ${session.patient.firstName} ${session.patient.lastName}? This action cannot be undone.`,
    )

    if (confirmed) {
      try {
        await StorageManager.deleteSession(session.id)
        router.push("/reports")
      } catch (error) {
        console.error("Failed to delete session:", error)
        alert("Failed to delete session. Please try again.")
      }
    }
  }

  const handleShare = async () => {
    if (!session?.patient) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hearing Test Results - ${session.patient.firstName} ${session.patient.lastName}`,
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

  const handleGenerateReport = async () => {
    if (!session?.patient) return

    setIsGeneratingPDF(true)
    try {
      await PDFReportGenerator.downloadPDF({
        patient: session.patient,
        session: session,
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
    if (!session?.patient) return

    try {
      await PDFReportGenerator.printPDF({
        patient: session.patient,
        session: session,
        testerName: testerName || undefined,
      })
    } catch (error) {
      console.error("Failed to print PDF:", error)
      alert("Failed to print report. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading test report...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Test report not found.</p>
          <Button asChild>
            <Link href="/reports">Back to Reports</Link>
          </Button>
        </div>
      </div>
    )
  }

  const audiogramData = thresholdsToAudiogramData(session.thresholds)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/reports">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Reports
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  {session.patient.firstName} {session.patient.lastName}
                </h1>
                <p className="text-sm text-slate-600">
                  Test Date: {new Date(session.startedAt).toLocaleDateString()} •{" "}
                  {session.completedAt ? "Completed" : "In Progress"}
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
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Patient Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="font-semibold text-lg mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <div className="font-medium">
                  {session.patient.firstName} {session.patient.lastName}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Date of Birth:</span>
                <div className="font-medium">{new Date(session.patient.dob).toLocaleDateString()}</div>
              </div>
              {session.patient.sex && (
                <div>
                  <span className="text-muted-foreground">Sex:</span>
                  <div className="font-medium">{session.patient.sex}</div>
                </div>
              )}
              {session.patient.patientId && (
                <div>
                  <span className="text-muted-foreground">Patient ID:</span>
                  <div className="font-medium">{session.patient.patientId}</div>
                </div>
              )}
            </div>
            {session.patient.notes && (
              <div className="mt-4">
                <span className="text-muted-foreground text-sm">Notes:</span>
                <div className="text-sm mt-1">{session.patient.notes}</div>
              </div>
            )}
          </div>

          {/* Audiogram */}
          <AudiogramChart data={audiogramData} title="Pure Tone Audiogram" />

          {/* Detailed Summary */}
          <HearingSummary thresholds={session.thresholds} testDuration={session.durationSec} />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleGenerateReport} disabled={isGeneratingPDF} size="lg" className="flex-1 sm:flex-none">
              <Download className="w-5 h-5 mr-2" />
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF Report"}
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none bg-transparent">
              <Link href="/reports">
                <FileText className="w-5 h-5 mr-2" />
                Back to All Reports
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
