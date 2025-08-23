"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, FileText, Trash2 } from "lucide-react"
import Link from "next/link"
import type { StoredSession } from "@/lib/storage"
import { calculatePTA, getHearingLossColor } from "@/lib/audiogram-utils"

interface SessionCardProps {
  session: StoredSession
  onDelete?: (sessionId: string) => void
  showPatientName?: boolean
}

export function SessionCard({ session, onDelete, showPatientName = true }: SessionCardProps) {
  const { patient } = session

  if (!patient) {
    return null
  }

  const rightPTA = calculatePTA(session.thresholds, "Right")
  const leftPTA = calculatePTA(session.thresholds, "Left")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (confirm(`Delete test results for ${patient.firstName} ${patient.lastName}?`)) {
      onDelete?.(session.id)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            {showPatientName && (
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-4 h-4" />
                {patient.firstName} {patient.lastName}
              </CardTitle>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(session.startedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(session.startedAt)}
              </div>
              {session.durationSec && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(session.durationSec)}
                </div>
              )}
            </div>
          </div>

          {onDelete && (
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* PTA Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-slate-900">{rightPTA.pta} dB</div>
            <div className="text-xs text-slate-600 mb-1">Right Ear PTA</div>
            <Badge className={`${getHearingLossColor(rightPTA.interpretation)} bg-transparent border-current text-xs`}>
              {rightPTA.interpretation}
            </Badge>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-slate-900">{leftPTA.pta} dB</div>
            <div className="text-xs text-slate-600 mb-1">Left Ear PTA</div>
            <Badge className={`${getHearingLossColor(leftPTA.interpretation)} bg-transparent border-current text-xs`}>
              {leftPTA.interpretation}
            </Badge>
          </div>
        </div>

        {/* Test Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{session.thresholds.length} frequencies tested</span>
          <span>
            {session.completedAt ? (
              <Badge variant="secondary" className="text-xs">
                Completed
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                In Progress
              </Badge>
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/reports/${session.id}`}>
              <FileText className="w-3 h-3 mr-1" />
              View Report
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
