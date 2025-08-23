"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Volume2, Headphones, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"

export default function OnboardingPage() {
  const router = useRouter()
  const { currentPatient } = useAppStore()
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const requirements = [
    {
      id: "headphones",
      icon: Headphones,
      title: "Over-ear headphones connected",
      description: "Use quality over-ear headphones for best isolation and accuracy",
    },
    {
      id: "quiet",
      icon: Shield,
      title: "Quiet environment confirmed",
      description: "Find a quiet room with minimal background noise",
    },
    {
      id: "volume",
      icon: Volume2,
      title: "Device volume at 75%",
      description: "Set your device volume to approximately 75% before starting",
    },
  ]

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setCheckedItems(newChecked)
  }

  const allChecked = requirements.every((req) => checkedItems.has(req.id))

  const handleContinue = () => {
    router.push("/calibration")
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
              <Link href="/patient">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Environment Check</h1>
              <p className="text-sm text-slate-600">
                Testing: {currentPatient.firstName} {currentPatient.lastName}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prepare Your Testing Environment</CardTitle>
            <CardDescription>Ensure optimal conditions for accurate hearing assessment results.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requirements.map((req) => {
              const Icon = req.icon
              const isChecked = checkedItems.has(req.id)

              return (
                <div
                  key={req.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isChecked ? "border-green-200 bg-green-50" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  onClick={() => toggleCheck(req.id)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isChecked ? "bg-green-600" : "bg-slate-100"
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{req.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{req.description}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p>You will hear tones in each ear at different volumes and frequencies</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p>Press "Heard" immediately when you detect a tone, even if it's very quiet</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p>Press "Not Heard" if you don't detect anything after the tone stops</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p>Stay focused and respond quickly - the test will take about 8-10 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleContinue} disabled={!allChecked} className="w-full" size="lg">
          Continue to Calibration
        </Button>
      </main>
    </div>
  )
}
