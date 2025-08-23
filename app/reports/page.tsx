"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Download, Plus } from "lucide-react"
import Link from "next/link"
import { SessionCard } from "@/components/session-card"
import { ReportsFilter } from "@/components/reports-filter"
import { StorageManager, type StoredSession } from "@/lib/storage"

export default function ReportsPage() {
  const [sessions, setSessions] = useState<StoredSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<StoredSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const allSessions = await StorageManager.getAllSessions()
      setSessions(allSessions)
      setFilteredSessions(allSessions)
    } catch (error) {
      console.error("Failed to load sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    try {
      const searchResults = await StorageManager.searchSessions(query)
      setFilteredSessions(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  const handleDateFilter = async (range: { start?: Date; end?: Date }) => {
    if (!range.start && !range.end) {
      setFilteredSessions(sessions)
      return
    }

    try {
      const startDate = range.start || new Date("1900-01-01")
      const endDate = range.end || new Date()
      const dateFilteredSessions = await StorageManager.getSessionsInDateRange(startDate, endDate)
      setFilteredSessions(dateFilteredSessions)
    } catch (error) {
      console.error("Date filter failed:", error)
    }
  }

  const handleStatusFilter = (status: "all" | "completed" | "in-progress") => {
    if (status === "all") {
      setFilteredSessions(sessions)
    } else {
      const statusFiltered = sessions.filter((session) => {
        if (status === "completed") return !!session.completedAt
        if (status === "in-progress") return !session.completedAt
        return true
      })
      setFilteredSessions(statusFiltered)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await StorageManager.deleteSession(sessionId)
      await loadSessions() // Reload the list
    } catch (error) {
      console.error("Failed to delete session:", error)
      alert("Failed to delete session. Please try again.")
    }
  }

  const handleExportData = async () => {
    try {
      const data = await StorageManager.exportAllData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `hearright-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Failed to export data. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading test reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-semibold">Test Reports</h1>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleExportData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Data
              </Button>
              <Button asChild size="sm">
                <Link href="/patient">
                  <Plus className="w-4 h-4 mr-1" />
                  New Test
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {sessions.length === 0 ? (
          /* Empty State */
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No Test Reports Yet</CardTitle>
              <CardDescription>Start your first hearing test to see results here.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg">
                <Link href="/patient">
                  <Plus className="w-5 h-5 mr-2" />
                  Start New Test
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <ReportsFilter
              onSearch={handleSearch}
              onDateFilter={handleDateFilter}
              onStatusFilter={handleStatusFilter}
              totalCount={sessions.length}
              filteredCount={filteredSessions.length}
            />

            {/* Sessions Grid */}
            {filteredSessions.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-muted-foreground">No test reports match your current filters.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onDelete={handleDeleteSession}
                    showPatientName={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
