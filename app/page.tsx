import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, Play, FileText, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">HearRight</h1>
              <p className="text-sm text-slate-600">Professional Audiometry</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Screen hearing in minutes. Anywhere.</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Professional-grade audiometry testing using advanced algorithms and calibrated audio. Get reliable hearing
            assessments in under 10 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/patient">
                <Play className="w-5 h-5 mr-2" />
                Start New Test
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/reports">
                <FileText className="w-5 h-5 mr-2" />
                View Past Reports
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Fast & Efficient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete hearing assessments in under 10 minutes using optimized down-10/up-5 staircase methodology.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Clinical Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Professional audiometry standards with proper calibration, threshold detection, and medical-grade
                reporting.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Comprehensive Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate detailed PDF reports with audiograms, interpretations, and clinical recommendations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Guide */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Quick Start Guide</CardTitle>
            <CardDescription className="text-blue-700">Follow these simple steps for accurate results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-blue-900">Use over-ear headphones</p>
                  <p className="text-blue-700">For best accuracy and isolation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-blue-900">Sit in a quiet space</p>
                  <p className="text-blue-700">Minimize background noise</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-blue-900">Follow the beeps!</p>
                  <p className="text-blue-700">Press when you hear tones</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
