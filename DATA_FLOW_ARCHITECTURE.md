# HearRight - Data Flow Architecture

## System Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                         │
├─────────────────────────────────────────────────────────────────────┤
│  Home → Patient Info → Environment → Calibration → Test → Summary  │
│  (page.tsx) (patient/page.tsx) (onboarding) (calibration) (test)   │
└────────────────────┬────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────────────┐
│                    REACT COMPONENTS LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│ │ ResponsePad     │  │ TestController   │  │ AudiogramChart   │   │
│ │ (Input Capture) │  │ (Test Logic)     │  │ (Visualization) │   │
│ └────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘   │
│          │                    │                     │              │
│ ┌────────▼────────────────────▼─────────────────────▼──────┐       │
│ │         Zustand Store (State Management)                │       │
│ │ ┌──────────────┐ ┌────────────────┐ ┌───────────────┐ │       │
│ │ │ currentPatient│ currentCalibration currentSession │ │       │
│ │ └──────────────┘ └────────────────┘ └───────────────┘ │       │
│ └──────────────────────────┬───────────────────────────────┘       │
└────────────────────────────┼──────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                           │
├──────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│ │ AudioEngine      │  │ CalibrationManager│  │ Hughson-     │   │
│ │ (Web Audio API)  │  │ (Device Settings)│  │ Westlake     │   │
│ │                  │  │                  │  │ Algorithm    │   │
│ └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘   │
│          │                     │                   │             │
│          └─────────────────────┼───────────────────┘             │
│                                │                                 │
│          ┌──────────────────────▼──────────────────┐             │
│          │  Data Processing & Calculations        │             │
│          │ ┌────────────────────────────────────┐ │             │
│          │ │ calculatePTA()                     │ │             │
│          │ │ formatAudiogram()                  │ │             │
│          │ │ getHearingLossDescription()        │ │             │
│          │ └────────────────────────────────────┘ │             │
│          └──────────────────────────────────────────┘             │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                      DATA STORAGE LAYER                           │
├──────────────────────────────────────────────────────────────────┤
│ ┌────────────────────┐         ┌──────────────────────────────┐ │
│ │  IndexedDB         │         │   localStorage              │ │
│ │  (Persistent)      │         │   (Calibration Profiles)   │ │
│ │                    │         │                            │ │
│ │ - Patients         │         │ - Device Settings           │ │
│ │ - Sessions         │         │ - User Preferences         │ │
│ │ - Thresholds       │         │ - Cache Data                │ │
│ │ - Reports          │         │                            │ │
│ └────────────────────┘         └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                    EXTERNAL SERVICES                              │
├──────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│ │ Web Audio API    │  │ PDF Generation   │  │ Service Worker │ │
│ │ (Audio Output)   │  │ (pdf-lib)        │  │ (Offline Mode) │ │
│ └──────────────────┘  └──────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

## Detailed Data Flow - Test Session

\`\`\`
1. USER INITIATES TEST
   └─→ Clicks "Start New Test"
   
2. PATIENT INFORMATION
   └─→ Form Input (Name, DOB, Sex, ID)
       └─→ Validation
           └─→ generateUUID() creates unique ID
               └─→ Store in Zustand (setCurrentPatient)
                   └─→ IndexedDB persistence
                       └─→ Route to /onboarding

3. ENVIRONMENT CHECK
   └─→ Display instructions & requirements
       └─→ Confirm quiet space
           └─→ Check microphone access
               └─→ Route to /calibration

4. DEVICE CALIBRATION
   └─→ AudioEngine initializes Web Audio API
       └─→ Load or create CalibrationProfile
           └─→ Test audio output:
               ├─→ Left channel
               ├─→ Right channel
               └─→ Reference frequencies
           └─→ User adjusts volume to reference level
               └─→ CalibrationManager.saveCalibration()
                   └─→ Store in localStorage
                       └─→ Route to /test

5. PURE TONE AUDIOMETRY TEST
   └─→ Create Session with generateUUID()
       └─→ Hughson-Westlake Algorithm initiates
           └─→ For each frequency (500, 1000, 2000, 4000 Hz):
               ├─→ For each ear (Right, Left):
               │   ├─→ AudioEngine.playTone(frequency, intensity)
               │   ├─→ User responds via ResponsePad (keypress/click)
               │   ├─→ Staircase.addResponse() updates threshold
               │   ├─→ Calculate next intensity (up 5dB or down 10dB)
               │   ├─→ Repeat until convergence (1 reversal)
               │   └─→ Store Threshold in Session
               │
               └─→ When complete:
                   └─→ Calculate PTA (Pure Tone Average)
                       └─→ Store durationSec
                           └─→ completeSession()
                               └─→ Route to /summary

6. RESULTS SUMMARY & REPORT
   └─→ AudiogramChart renders thresholds
       └─→ Display audiogram with symbols:
           ├─→ Right Ear: Red circles (O)
           ├─→ Left Ear: Blue X marks
           └─→ Dashed connecting lines
       └─→ Calculate interpretations
           └─→ Show PTA classifications
               └─→ Generate PDF via PDFReportGenerator
                   ├─→ Draw multi-page report:
                   │   ├─→ Page 1: Header, Patient Info, Test Summary
                   │   ├─→ Page 2: Thresholds Table & Audiogram
                   │   └─→ Page 3: PTA Results & Clinical Notes
                   │
                   └─→ Download or Print
                       └─→ Store in IndexedDB
                           └─→ Accessible via Reports page

7. REPORTS MANAGEMENT
   └─→ Display all past sessions
       └─→ Filter by date/patient
           └─→ View detailed results
               └─→ Download PDF
                   └─→ Export session data
                       └─→ Delete session (if needed)
\`\`\`

## Component Interaction Diagram

\`\`\`
HOME PAGE (/)
├─ Start New Test → PATIENT INFO (/patient)
│                   ├─ Form Submission
│                   └─ generateUUID() → Zustand Store
│                       └─ Redirect to ONBOARDING
│
├─ View Reports → REPORTS (/reports)
│                 ├─ Query IndexedDB
│                 ├─ Filter Sessions
│                 └─ ReportsFilter Component
│                     └─ Select Session
│                         └─ REPORT DETAIL (/reports/[id])
│
└─ Calibration → CALIBRATION (/calibration)
                 ├─ CalibrationManager.getCalibrations()
                 ├─ Load or Create Profile
                 ├─ AudioEngine.playTone()
                 ├─ User adjusts volume
                 └─ CalibrationManager.saveCalibration()

ONBOARDING (/onboarding)
├─ Display Instructions
├─ Environment Checklist
└─ → TEST (/test)

CALIBRATION (/calibration)
├─ CalibrationCard Component
├─ Device Selection
├─ Channel Testing
├─ Frequency Adjustments
└─ → TEST (/test)

TEST (/test)
├─ TestController
│  ├─ Hughson-Westlake Algorithm
│  ├─ AudioEngine.playTone()
│  ├─ ResponsePad (User Input)
│  └─ Threshold Calculation
│
├─ Zustand Store Updates
│  ├─ addThreshold(threshold)
│  └─ completeSession()
│
└─ → SUMMARY (/summary)

SUMMARY (/summary)
├─ AudiogramChart
│  ├─ Plot thresholds
│  └─ Display interpretations
│
├─ HearingSummary
│  ├─ Calculate PTA
│  ├─ Show classifications
│  └─ Edit thresholds
│
├─ PDFReportGenerator
│  ├─ Multi-page PDF generation
│  ├─ Audiogram rendering
│  └─ Clinical notes
│
├─ Download PDF
├─ Print PDF
└─ Save to IndexedDB
   └─ Redirect to REPORTS (/reports)
\`\`\`

## State Management (Zustand Store)

\`\`\`typescript
AppStore {
  // Current Entities
  currentPatient: Patient | null
  currentCalibration: CalibrationProfile | null
  currentSession: Session | null
  
  // Collections
  thresholds: Threshold[]
  patients: Patient[]
  
  // Timing
  testStartTime: number
  
  // Actions
  setCurrentPatient(patient: Patient)
  setCurrentCalibration(calibration: CalibrationProfile)
  setCurrentSession(session: Session)
  addThreshold(threshold: Threshold)
  completeSession()
  setTestStartTime(time: number)
  reset()
}
\`\`\`

## Database Schema (IndexedDB)

\`\`\`
Dexie.defineVersion({
  patients: "++id",
  sessions: "++id, patientId",
  thresholds: "++id, sessionId, freqHz, ear"
})

Patient: {
  id: UUID,
  firstName: string,
  lastName: string,
  dob: date,
  sex: "Male" | "Female" | "Other" | "Prefer not to say",
  patientId?: string,
  notes?: string,
  createdAt: ISO8601
}

Session: {
  id: UUID,
  patientId: UUID,
  calibrationId: UUID,
  startedAt: ISO8601,
  endedAt?: ISO8601,
  durationSec?: number,
  thresholds: Threshold[]
}

Threshold: {
  id: UUID,
  sessionId: UUID,
  freqHz: 500 | 1000 | 2000 | 4000,
  ear: "Right" | "Left",
  thresholdDb: 0-120,
  reactions: number[]
}

CalibrationProfile: {
  id: UUID,
  deviceLabel: string,
  createdAt: ISO8601,
  points: CalibrationPoint[],
  outputGain: number
}
\`\`\`

## Error Handling Flow

\`\`\`
User Action
└─→ Component Event Handler
    └─→ Try-Catch Block
        ├─→ Success: Update State
        │   └─→ Re-render UI
        │       └─→ Persist to Storage
        │
        └─→ Error Caught
            ├─→ Log to Console
            ├─→ Display Toast/Modal
            ├─→ Rollback State
            └─→ Offer Retry/Home Action
\`\`\`

## Performance Optimization

\`\`\`
1. Code Splitting
   └─→ Route-based lazy loading
       └─→ Reduced initial bundle

2. Caching Strategy
   ├─→ Browser Cache (Service Worker)
   ├─→ LocalStorage (Calibration)
   └─→ IndexedDB (Data Persistence)

3. Audio Optimization
   ├─→ Efficient tone generation (Web Audio API)
   ├─→ Single AudioContext per session
   └─→ Garbage collection on test complete

4. PDF Generation
   ├─→ Client-side processing
   ├─→ Multi-page auto-pagination
   └─→ Streaming for large documents

5. State Management
   ├─→ Zustand (minimal overhead)
   ├─→ Selector-based subscriptions
   └─→ No Redux boilerplate
\`\`\`

---
Last Updated: November 2025
