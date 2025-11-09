import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { Patient, Session, Threshold } from "./types"
import { calculatePTA, getHearingLossDescription, formatFrequency } from "./audiogram-utils"

export interface PDFReportData {
  patient: Patient
  session: Session
  testerName?: string
  environmentNotes?: string
}

export class PDFReportGenerator {
  private static readonly COLORS = {
    primary: rgb(0.059, 0.094, 0.165), // slate-900
    secondary: rgb(0.374, 0.447, 0.525), // slate-600
    accent: rgb(0.147, 0.51, 0.961), // blue-600
    success: rgb(0.133, 0.773, 0.333), // green-600
    warning: rgb(0.917, 0.698, 0.133), // yellow-600
    danger: rgb(0.863, 0.196, 0.184), // red-600
    light: rgb(0.97, 0.976, 0.984), // slate-50
  }

  private static readonly PAGE_HEIGHT = 792
  private static readonly PAGE_WIDTH = 612
  private static readonly MARGIN = 60
  private static readonly CONTENT_WIDTH = this.PAGE_WIDTH - this.MARGIN * 2

  static async generateReport(data: PDFReportData): Promise<Uint8Array> {
    const { patient, session } = data

    const pdfDoc = await PDFDocument.create()
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    let page = pdfDoc.addPage([this.PAGE_WIDTH, this.PAGE_HEIGHT])
    let yPosition = this.PAGE_HEIGHT - 60

    // Page 1: Header, Patient Info, Test Summary
    yPosition = this.drawHeader(page, boldFont, regularFont, yPosition)
    yPosition = this.drawPatientInfo(page, boldFont, regularFont, patient, yPosition)
    yPosition = this.drawTestSummary(page, boldFont, regularFont, session, yPosition)

    // Check if we need a new page for threshold table
    if (yPosition < 200) {
      page = pdfDoc.addPage([this.PAGE_WIDTH, this.PAGE_HEIGHT])
      yPosition = this.PAGE_HEIGHT - 60
    }

    yPosition = this.drawThresholdTable(page, boldFont, regularFont, session.thresholds, yPosition)

    // Check if we need a new page for audiogram
    if (yPosition < 300) {
      page = pdfDoc.addPage([this.PAGE_WIDTH, this.PAGE_HEIGHT])
      yPosition = this.PAGE_HEIGHT - 60
    }

    yPosition = this.drawAudiogram(page, boldFont, regularFont, session.thresholds, yPosition)

    // Check if we need a new page for PTA results
    if (yPosition < 150) {
      page = pdfDoc.addPage([this.PAGE_WIDTH, this.PAGE_HEIGHT])
      yPosition = this.PAGE_HEIGHT - 60
    }

    yPosition = this.drawPTAResults(page, boldFont, regularFont, session.thresholds, yPosition)

    // Check if we need a new page for clinical notes
    if (yPosition < 150) {
      page = pdfDoc.addPage([this.PAGE_WIDTH, this.PAGE_HEIGHT])
      yPosition = this.PAGE_HEIGHT - 60
    }

    yPosition = this.drawClinicalNotes(page, boldFont, regularFont, yPosition)

    // Footer on all pages
    const pageCount = pdfDoc.getPages().length
    pdfDoc.getPages().forEach((pg, index) => {
      this.drawFooter(pg, regularFont, index + 1, pageCount)
    })

    return await pdfDoc.save()
  }

  private static drawHeader(page: any, boldFont: any, regularFont: any, yPosition: number): number {
    page.drawText("HearRight", {
      x: this.MARGIN,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: this.COLORS.primary,
    })

    page.drawText("App-Based Audiometer", {
      x: this.MARGIN,
      y: yPosition - 20,
      size: 12,
      font: regularFont,
      color: this.COLORS.secondary,
    })

    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    page.drawText("HEARING ASSESSMENT REPORT", {
      x: this.PAGE_WIDTH - 300,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: this.COLORS.primary,
    })

    page.drawText(`Generated: ${reportDate}`, {
      x: this.PAGE_WIDTH - 300,
      y: yPosition - 20,
      size: 10,
      font: regularFont,
      color: this.COLORS.secondary,
    })

    page.drawLine({
      start: { x: this.MARGIN, y: yPosition - 40 },
      end: { x: this.PAGE_WIDTH - this.MARGIN, y: yPosition - 40 },
      thickness: 1,
      color: this.COLORS.light,
    })

    return yPosition - 60
  }

  private static drawPatientInfo(
    page: any,
    boldFont: any,
    regularFont: any,
    patient: Patient,
    yPosition: number,
  ): number {
    page.drawText("PATIENT INFORMATION", {
      x: this.MARGIN,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: this.COLORS.primary,
    })

    yPosition -= 25

    const leftColumn = this.MARGIN
    const rightColumn = this.PAGE_WIDTH / 2 + 30

    page.drawText("Name:", {
      x: leftColumn,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: this.COLORS.secondary,
    })

    page.drawText(`${patient.firstName} ${patient.lastName}`, {
      x: leftColumn + 80,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: this.COLORS.primary,
    })

    page.drawText("Date of Birth:", {
      x: leftColumn,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
      color: this.COLORS.secondary,
    })

    page.drawText(new Date(patient.dob).toLocaleDateString(), {
      x: leftColumn + 80,
      y: yPosition - 15,
      size: 10,
      font: regularFont,
      color: this.COLORS.primary,
    })

    if (patient.sex) {
      page.drawText("Sex:", {
        x: rightColumn,
        y: yPosition,
        size: 10,
        font: boldFont,
        color: this.COLORS.secondary,
      })

      page.drawText(patient.sex, {
        x: rightColumn + 60,
        y: yPosition,
        size: 10,
        font: regularFont,
        color: this.COLORS.primary,
      })
    }

    if (patient.patientId) {
      page.drawText("Patient ID:", {
        x: rightColumn,
        y: yPosition - 15,
        size: 10,
        font: boldFont,
        color: this.COLORS.secondary,
      })

      page.drawText(patient.patientId, {
        x: rightColumn + 60,
        y: yPosition - 15,
        size: 10,
        font: regularFont,
        color: this.COLORS.primary,
      })
    }

    return yPosition - 40
  }

  private static drawTestSummary(
    page: any,
    boldFont: any,
    regularFont: any,
    session: Session,
    yPosition: number,
  ): number {
    page.drawText("TEST SUMMARY", {
      x: this.MARGIN,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: this.COLORS.primary,
    })

    yPosition -= 25

    const testDate = new Date(session.startedAt).toLocaleDateString()
    const testTime = new Date(session.startedAt).toLocaleTimeString()
    const duration = session.durationSec
      ? `${Math.floor(session.durationSec / 60)}:${(session.durationSec % 60).toString().padStart(2, "0")}`
      : "Unknown"

    page.drawText(`Test Date: ${testDate}`, {
      x: this.MARGIN,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: this.COLORS.primary,
    })

    page.drawText(`Test Time: ${testTime}`, {
      x: 200,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: this.COLORS.primary,
    })

    page.drawText(`Duration: ${duration}`, {
      x: 340,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: this.COLORS.primary,
    })

    page.drawText(`Frequencies Tested: ${session.thresholds.length}`, {
      x: 450,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: this.COLORS.primary,
    })

    return yPosition - 30
  }

  private static drawThresholdTable(
    page: any,
    boldFont: any,
    regularFont: any,
    thresholds: Threshold[],
    yPosition: number,
  ): number {
    page.drawText("HEARING THRESHOLDS (dB HL)", {
      x: this.MARGIN,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: this.COLORS.primary,
    })

    yPosition -= 25

    const frequencies = [...new Set(thresholds.map((t) => t.freqHz))].sort((a, b) => a - b)
    const tableX = this.MARGIN
    const colWidth = this.CONTENT_WIDTH / (frequencies.length + 1)

    page.drawText("Ear", {
      x: tableX,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: this.COLORS.primary,
    })

    frequencies.forEach((freq, index) => {
      page.drawText(`${formatFrequency(freq)} Hz`, {
        x: tableX + (index + 1) * colWidth,
        y: yPosition,
        size: 10,
        font: boldFont,
        color: this.COLORS.primary,
      })
    })

    yPosition -= 20

    page.drawText("Right", {
      x: tableX,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: this.COLORS.danger,
    })

    frequencies.forEach((freq, index) => {
      const threshold = thresholds.find((t) => t.freqHz === freq && t.ear === "Right")
      const value = threshold ? `${threshold.thresholdDb}` : "NR"

      page.drawText(value, {
        x: tableX + (index + 1) * colWidth,
        y: yPosition,
        size: 10,
        font: regularFont,
        color: this.COLORS.primary,
      })
    })

    yPosition -= 15

    page.drawText("Left", {
      x: tableX,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: this.COLORS.accent,
    })

    frequencies.forEach((freq, index) => {
      const threshold = thresholds.find((t) => t.freqHz === freq && t.ear === "Left")
      const value = threshold ? `${threshold.thresholdDb}` : "NR"

      page.drawText(value, {
        x: tableX + (index + 1) * colWidth,
        y: yPosition,
        size: 10,
        font: regularFont,
        color: this.COLORS.primary,
      })
    })

    page.drawRectangle({
      x: tableX - 5,
      y: yPosition - 10,
      width: this.CONTENT_WIDTH,
      height: 50,
      borderColor: this.COLORS.light,
      borderWidth: 1,
    })

    return yPosition - 30
  }

  private static drawAudiogram(
    page: any,
    boldFont: any,
    regularFont: any,
    thresholds: Threshold[],
    yPosition: number,
  ): number {
    page.drawText("AUDIOGRAM", {
      x: this.MARGIN,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: this.COLORS.primary,
    })

    yPosition -= 25

    const chartX = 80
    const chartY = yPosition - 200
    const chartWidth = this.PAGE_WIDTH - 160
    const chartHeight = 180

    page.drawRectangle({
      x: chartX,
      y: chartY,
      width: chartWidth,
      height: chartHeight,
      color: rgb(0.99, 0.99, 0.99),
      borderColor: this.COLORS.secondary,
      borderWidth: 1,
    })

    const frequencies = [500, 1000, 2000, 4000]
    const hearingLevels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]

    // Draw grid and labels (unchanged)
    frequencies.forEach((freq, index) => {
      const x = chartX + (index * chartWidth) / (frequencies.length - 1)

      page.drawLine({
        start: { x, y: chartY },
        end: { x, y: chartY + chartHeight },
        thickness: 0.5,
        color: rgb(0.9, 0.9, 0.9),
      })

      page.drawText(`${formatFrequency(freq)}`, {
        x: x - 15,
        y: chartY - 15,
        size: 8,
        font: regularFont,
        color: this.COLORS.primary,
      })
    })

    hearingLevels.forEach((level) => {
      const y = chartY + chartHeight - (level / 120) * chartHeight

      page.drawLine({
        start: { x: chartX, y },
        end: { x: chartX + chartWidth, y },
        thickness: level % 20 === 0 ? 1 : 0.5,
        color: level % 20 === 0 ? rgb(0.8, 0.8, 0.8) : rgb(0.9, 0.9, 0.9),
      })

      page.drawText(`${level}`, {
        x: chartX - 20,
        y: y - 3,
        size: 8,
        font: regularFont,
        color: this.COLORS.primary,
      })
    })

    page.drawText("Hearing Level (dB HL)", {
      x: 25,
      y: chartY + chartHeight / 2,
      size: 10,
      font: boldFont,
      color: this.COLORS.primary,
      rotate: { type: "degrees", angle: 90 },
    })

    page.drawText("Frequency (Hz)", {
      x: chartX + chartWidth / 2 - 40,
      y: chartY - 35,
      size: 10,
      font: boldFont,
      color: this.COLORS.primary,
    })

    const rightThresholds = thresholds.filter((t) => t.ear === "Right").sort((a, b) => a.freqHz - b.freqHz)
    const leftThresholds = thresholds.filter((t) => t.ear === "Left").sort((a, b) => a.freqHz - b.freqHz)

    const getCoordinates = (freq: number, threshold: number) => {
      const freqIndex = frequencies.indexOf(freq)
      if (freqIndex === -1) return null
      const x = chartX + (freqIndex * chartWidth) / (frequencies.length - 1)
      const y = chartY + chartHeight - (threshold / 120) * chartHeight
      return { x, y }
    }

    // Plot right ear
    let prevRightCoords = null
    rightThresholds.forEach((threshold) => {
      const coords = getCoordinates(threshold.freqHz, threshold.thresholdDb)
      if (!coords) return
      page.drawCircle({
        x: coords.x,
        y: coords.y,
        size: 4,
        borderColor: this.COLORS.danger,
        borderWidth: 2,
      })
      if (prevRightCoords) {
        page.drawLine({
          start: prevRightCoords,
          end: coords,
          thickness: 1,
          color: this.COLORS.danger,
          dashArray: [3, 2],
        })
      }
      prevRightCoords = coords
    })

    // Plot left ear
    let prevLeftCoords = null
    leftThresholds.forEach((threshold) => {
      const coords = getCoordinates(threshold.freqHz, threshold.thresholdDb)
      if (!coords) return
      const size = 4
      page.drawLine({
        start: { x: coords.x - size, y: coords.y - size },
        end: { x: coords.x + size, y: coords.y + size },
        thickness: 2,
        color: this.COLORS.accent,
      })
      page.drawLine({
        start: { x: coords.x - size, y: coords.y + size },
        end: { x: coords.x + size, y: coords.y - size },
        thickness: 2,
        color: this.COLORS.accent,
      })
      if (prevLeftCoords) {
        page.drawLine({
          start: prevLeftCoords,
          end: coords,
          thickness: 1,
          color: this.COLORS.accent,
          dashArray: [3, 2],
        })
      }
      prevLeftCoords = coords
    })

    // Legend
    const legendY = chartY + chartHeight + 20
    page.drawCircle({
      x: chartX + 20,
      y: legendY,
      size: 4,
      borderColor: this.COLORS.danger,
      borderWidth: 2,
    })
    page.drawText("Right Ear", {
      x: chartX + 35,
      y: legendY - 3,
      size: 9,
      font: regularFont,
      color: this.COLORS.primary,
    })

    const leftLegendX = chartX + 120
    page.drawLine({
      start: { x: leftLegendX - 4, y: legendY - 4 },
      end: { x: leftLegendX + 4, y: legendY + 4 },
      thickness: 2,
      color: this.COLORS.accent,
    })
    page.drawLine({
      start: { x: leftLegendX - 4, y: legendY + 4 },
      end: { x: leftLegendX + 4, y: legendY - 4 },
      thickness: 2,
      color: this.COLORS.accent,
    })
    page.drawText("Left Ear", {
      x: leftLegendX + 15,
      y: legendY - 3,
      size: 9,
      font: regularFont,
      color: this.COLORS.primary,
    })

    return yPosition - 260
  }

  private static drawPTAResults(
    page: any,
    boldFont: any,
    regularFont: any,
    thresholds: Threshold[],
    yPosition: number,
  ): number {
    page.drawText("PURE TONE AVERAGE & INTERPRETATION", {
      x: this.MARGIN,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: this.COLORS.primary,
    })

    yPosition -= 25

    const rightPTA = calculatePTA(thresholds, "Right")
    const leftPTA = calculatePTA(thresholds, "Left")

    page.drawText("Right Ear:", {
      x: this.MARGIN,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: this.COLORS.danger,
    })

    page.drawText(`PTA: ${rightPTA.pta} dB HL`, {
      x: 140,
      y: yPosition,
      size: 11,
      font: regularFont,
      color: this.COLORS.primary,
    })

    page.drawText(`Classification: ${rightPTA.interpretation}`, {
      x: 240,
      y: yPosition,
      size: 11,
      font: regularFont,
      color: this.COLORS.primary,
    })

    yPosition -= 15

    page.drawText(getHearingLossDescription(rightPTA.interpretation), {
      x: 80,
      y: yPosition,
      size: 9,
      font: regularFont,
      color: this.COLORS.secondary,
    })

    yPosition -= 20

    page.drawText("Left Ear:", {
      x: this.MARGIN,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: this.COLORS.accent,
    })

    page.drawText(`PTA: ${leftPTA.pta} dB HL`, {
      x: 140,
      y: yPosition,
      size: 11,
      font: regularFont,
      color: this.COLORS.primary,
    })

    page.drawText(`Classification: ${leftPTA.interpretation}`, {
      x: 240,
      y: yPosition,
      size: 11,
      font: regularFont,
      color: this.COLORS.primary,
    })

    yPosition -= 15

    page.drawText(getHearingLossDescription(leftPTA.interpretation), {
      x: 80,
      y: yPosition,
      size: 9,
      font: regularFont,
      color: this.COLORS.secondary,
    })

    return yPosition - 30
  }

  private static drawClinicalNotes(page: any, boldFont: any, regularFont: any, yPosition: number): number {
    page.drawText("CLINICAL NOTES", {
      x: this.MARGIN,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: this.COLORS.primary,
    })

    yPosition -= 20

    const notes = [
      "Method: Pure-tone air-conduction screening using down-10/up-5 staircase methodology",
      "(Hughson-Westlake procedure).",
      "",
      "Test Environment: Self-administered screening in user-controlled environment with",
      "calibrated audio output.",
      "",
      "Reliability: Thresholds determined by lowest level with 2/3 positive responses on",
      "ascending trials.",
      "",
      "Symbols: Right ear (O), Left ear (X). Dashed lines connect thresholds.",
    ]

    notes.forEach((note) => {
      if (note) {
        page.drawText(note, {
          x: this.MARGIN,
          y: yPosition,
          size: 9,
          font: regularFont,
          color: this.COLORS.primary,
        })
      }
      yPosition -= 12
    })

    return yPosition - 10
  }

  private static drawFooter(page: any, regularFont: any, pageNum: number, totalPages: number): void {
    const footerY = 60

    page.drawRectangle({
      x: this.MARGIN,
      y: footerY - 5,
      width: this.CONTENT_WIDTH,
      height: 30,
      color: rgb(1, 0.95, 0.8),
      borderColor: rgb(0.92, 0.73, 0.4),
      borderWidth: 1,
    })

    page.drawText("WARNING - MEDICAL DISCLAIMER", {
      x: this.MARGIN + 10,
      y: footerY + 15,
      size: 8,
      font: regularFont,
      color: rgb(0.6, 0.4, 0.1),
    })

    page.drawText("HearRight is a screening tool and not a substitute for a clinical diagnostic audiometer.", {
      x: this.MARGIN + 10,
      y: footerY + 5,
      size: 8,
      font: regularFont,
      color: rgb(0.6, 0.4, 0.1),
    })

    page.drawText("Results depend on device/headphone calibration and environment.", {
      x: this.MARGIN + 10,
      y: footerY - 5,
      size: 8,
      font: regularFont,
      color: rgb(0.6, 0.4, 0.1),
    })

    page.drawText(`Page ${pageNum} of ${totalPages} • Generated by HearRight v1.0`, {
      x: this.PAGE_WIDTH - 200,
      y: 30,
      size: 8,
      font: regularFont,
      color: this.COLORS.secondary,
    })
  }

  static async downloadPDF(data: PDFReportData, filename?: string): Promise<void> {
    const pdfBytes = await this.generateReport(data)
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)

    const defaultFilename = `HearRight-${data.patient.lastName}-${data.patient.firstName}-${new Date().toISOString().split("T")[0]}.pdf`

    const a = document.createElement("a")
    a.href = url
    a.download = filename || defaultFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  static async printPDF(data: PDFReportData): Promise<void> {
    const pdfBytes = await this.generateReport(data)
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)

    const printWindow = window.open(url)
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }
}
