"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit3 } from "lucide-react"
import type { AudiogramData } from "@/lib/audiogram-utils"
import { formatFrequency } from "@/lib/audiogram-utils"

interface AudiogramChartProps {
  data: AudiogramData[]
  title?: string
  editable?: boolean
  onDataChange?: (data: AudiogramData[]) => void
  className?: string
}

// Custom dot components for audiogram symbols
const RightEarDot = (props: any) => {
  const { cx, cy, payload } = props
  if (payload.rightEar === undefined) return null

  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="none" stroke="#dc2626" strokeWidth={2} />
      <text x={cx + 12} y={cy + 4} fontSize={10} fill="#dc2626" fontWeight="bold">
        O
      </text>
    </g>
  )
}

const LeftEarDot = (props: any) => {
  const { cx, cy, payload } = props
  if (payload.leftEar === undefined) return null

  return (
    <g>
      <line x1={cx - 6} y1={cy - 6} x2={cx + 6} y2={cy + 6} stroke="#2563eb" strokeWidth={2} />
      <line x1={cx - 6} y1={cy + 6} x2={cx + 6} y2={cy - 6} stroke="#2563eb" strokeWidth={2} />
      <text x={cx + 12} y={cy + 4} fontSize={10} fill="#2563eb" fontWeight="bold">
        X
      </text>
    </g>
  )
}

export function AudiogramChart({
  data,
  title = "Audiogram",
  editable = false,
  onDataChange,
  className,
}: AudiogramChartProps) {
  const [isEditing, setIsEditing] = useState(false)

  // Format frequency labels for X-axis
  const formatXAxisLabel = (value: number) => formatFrequency(value)

  const yAxisDomain = [0, 120]

  const handlePointClick = (dataPoint: AudiogramData, ear: "left" | "right") => {
    if (!editable || !onDataChange) return

    const newValue = prompt(
      `Enter new threshold for ${ear} ear at ${formatFrequency(dataPoint.frequency)} Hz (0-120 dB):`,
      String(ear === "left" ? dataPoint.leftEar || 0 : dataPoint.rightEar || 0),
    )

    if (newValue !== null && !isNaN(Number(newValue))) {
      const numValue = Number(newValue)
      if (numValue >= 0 && numValue <= 120) {
        const updatedData = data.map((item) => {
          if (item.frequency === dataPoint.frequency) {
            return {
              ...item,
              [ear === "left" ? "leftEar" : "rightEar"]: numValue,
            }
          }
          return item
        })
        onDataChange(updatedData)
      } else {
        alert("Please enter a value between 0 and 120 dB HL")
      }
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {title}
            <div className="flex gap-2">
              <Badge variant="outline" className="text-red-600 border-red-200">
                <span className="w-3 h-3 border border-red-600 rounded-full mr-1" />
                Right (O)
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <span className="w-3 h-3 mr-1">✕</span>
                Left (X)
              </Badge>
            </div>
          </CardTitle>
          {editable && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "bg-blue-50" : ""}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                {isEditing ? "Done" : "Edit"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              {/* X-axis: Frequencies */}
              <XAxis
                dataKey="frequency"
                type="number"
                scale="log"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatXAxisLabel}
                axisLine={{ stroke: "#64748b" }}
                tickLine={{ stroke: "#64748b" }}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />

              {/* Y-axis: Hearing Level (inverted) */}
              <YAxis
                domain={yAxisDomain}
                reversed={true}
                axisLine={{ stroke: "#64748b" }}
                tickLine={{ stroke: "#64748b" }}
                tick={{ fontSize: 12, fill: "#64748b" }}
                label={{ value: "Hearing Level (dB HL)", angle: -90, position: "insideLeft" }}
              />

              {/* Reference lines for hearing loss levels */}
              <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="2 2" opacity={0.5} />
              <ReferenceLine y={40} stroke="#eab308" strokeDasharray="2 2" opacity={0.5} />
              <ReferenceLine y={55} stroke="#f97316" strokeDasharray="2 2" opacity={0.5} />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" opacity={0.5} />
              <ReferenceLine y={90} stroke="#dc2626" strokeDasharray="2 2" opacity={0.5} />

              {/* Right ear line (red, dashed) */}
              <Line
                type="linear"
                dataKey="rightEar"
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={<RightEarDot />}
                connectNulls={false}
                onClick={isEditing ? (data) => handlePointClick(data.payload, "right") : undefined}
              />

              {/* Left ear line (blue, dashed) */}
              <Line
                type="linear"
                dataKey="leftEar"
                stroke="#2563eb"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={<LeftEarDot />}
                connectNulls={false}
                onClick={isEditing ? (data) => handlePointClick(data.payload, "left") : undefined}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hearing level legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500" />
            <span>Normal (0-25 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-yellow-500" />
            <span>Mild (26-40 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-orange-500" />
            <span>Moderate (41-55 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500" />
            <span>Mod. Severe (56-70 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-600" />
            <span>Severe (71-90 dB)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-900" />
            <span>Profound &gt;90 dB</span>
          </div>
        </div>

        {isEditing && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Edit Mode:</strong> Click on any data point to modify threshold values. Changes are saved
              automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
