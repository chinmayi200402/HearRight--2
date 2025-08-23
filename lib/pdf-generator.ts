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

  static async generateReport(data: PDFReportData): Promise<Uint8Array> {
    const { patient, session } = data

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([612, 792]) // Letter size
    const { width, height } = page.getSize()

    // Load fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    let yPosition = height - 60

    // Header
    yPosition = this.drawHeader(page, boldFont, regularFont, yPosition, width)

    // Patient Information
    yPosition = this.drawPatientInfo(page, boldFont, regularFont, patient, yPosition, width)

    // Test Summary
    yPosition = this.drawTestSummary(page, boldFont, regularFont, session, yPosition, width)

    // Threshold Table
    yPosition = this.drawThresholdTable(page, boldFont, regularFont, session.thresholds, yPosition, width)

    // PTA and Interpretation
    yPosition = this.drawPTAResults(page, boldFont, regularFont, session.thresholds, yPosition, width)

    // Clinical Notes
    yPosition = this.drawClinicalNotes(page, boldFont, regularFont, yPosition, width)

    // Footer with disclaimer
    this.drawFooter(page, regularFont, width)

    return await pdfDoc.save()
  }

  private static drawHeader(page: any, boldFont: any, regularFont: any, yPosition: number, width: number): number {
    // HearRight Logo/Title
    page.drawText("HearRight", {
      x: 60,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: this.COLORS.primary,
    })

    page.drawText("App-Based Audiometer", {
      x: 60,
      y: yPosition - 20,
      size: 12,
      font: regularFont,
      color: this.COLORS.secondary,
    })

    // Report title and date
    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    page.drawText("HEARING ASSESSMENT REPORT", {
      x: width - 300,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: this.COLORS.primary,
    })

    page.drawText(`Generated: ${reportDate}`, {
      x: width - 300,
      y: yPosition - 20,
      size: 10,
      font: regularFont,
      color: this.COLORS.secondary,
    })

    // Horizontal line
    page.drawLine({
      start: { x: 60, y: yPosition - 40 },
      end: { x: width - 60, y: yPosition - 40 },
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
    width: number,
  ): number {
    // Section title
    page.drawText("PATIENT INFORMATION", {
      x: 60,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: this.COLORS.primary,
    })

    yPosition -= 25

    // Patient details in two columns
    const leftColumn = 60
    const rightColumn = width / 2 + 30

    // Left column
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

    // Right column
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
    width: number,
  ): number {
    // Section title
    page.drawText("TEST SUMMARY", {
      x: 60,
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

    // Test details
    page.drawText(`Test Date: ${testDate}`, {
      x: 60,
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
    width: number,
  ): number {
    // Section title
    page.drawText("HEARING THRESHOLDS (dB HL)", {
      x: 60,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: this.COLORS.primary,
    })

    yPosition -= 25

    // Get unique frequencies
    const frequencies = [...new Set(thresholds.map((t) => t.freqHz))].sort((a, b) => a - b)

    // Table headers
    const tableX = 60
    const colWidth = (width - 120) / (frequencies.length + 1)

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

    // Right ear row
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

    // Left ear row
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

    // Table border
    page.drawRectangle({
      x: tableX - 5,
      y: yPosition - 10,
      width: width - 120,
      height: 50,
      borderColor: this.COLORS.light,
      borderWidth: 1,
    })

    return yPosition - 30
  }

  private static drawPTAResults(
    page: any,
    boldFont: any,
    regularFont: any,
    thresholds: Threshold[],
    yPosition: number,
    width: number,
  ): number {
    // Section title
    page.drawText("PURE TONE AVERAGE & INTERPRETATION", {
      x: 60,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: this.COLORS.primary,
    })

    yPosition -= 25

    const rightPTA = calculatePTA(thresholds, "Right")
    const leftPTA = calculatePTA(thresholds, "Left")

    // Right ear results
    page.drawText("Right Ear:", {
      x: 60,
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

    // Left ear results
    page.drawText("Left Ear:", {
      x: 60,
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

  private static drawClinicalNotes(
    page: any,
    boldFont: any,
    regularFont: any,
    yPosition: number,
    width: number,
  ): number {
    // Section title
    page.drawText("CLINICAL NOTES", {
      x: 60,
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
          x: 60,
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

  private static drawFooter(page: any, regularFont: any, width: number): void {
    const footerY = 60

    // Medical disclaimer
    page.drawRectangle({
      x: 60,
      y: footerY - 5,
      width: width - 120,
      height: 30,
      color: rgb(1, 0.95, 0.8), // amber-50
      borderColor: rgb(0.92, 0.73, 0.4), // amber-300
      borderWidth: 1,
    })

    page.drawText("WARNING - MEDICAL DISCLAIMER", {
      x: 70,
      y: footerY + 15,
      size: 8,
      font: regularFont,
      color: rgb(0.6, 0.4, 0.1), // amber-800
    })

    page.drawText("HearRight is a screening tool and not a substitute for a clinical diagnostic audiometer.", {
      x: 70,
      y: footerY + 5,
      size: 8,
      font: regularFont,
      color: rgb(0.6, 0.4, 0.1),
    })

    page.drawText("Results depend on device/headphone calibration and environment.", {
      x: 70,
      y: footerY - 5,
      size: 8,
      font: regularFont,
      color: rgb(0.6, 0.4, 0.1),
    })

    // Page number and generation info
    page.drawText(`Page 1 of 1 • Generated by HearRight v1.0`, {
      x: width - 200,
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
