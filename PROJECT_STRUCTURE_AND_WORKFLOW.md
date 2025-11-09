# HearRight Audiometer - Complete Project Structure & Workflow

## 📁 PROJECT FOLDER TREE

\`\`\`
hearright/
│
├── 📂 app/                          # Next.js 15 App Router - Page Routes
│   ├── layout.tsx                   # Root layout (fonts, providers, PWA register)
│   ├── page.tsx                     # Home page (welcome & start screen)
│   ├── globals.css                  # Global styles & design tokens
│   │
│   ├── 📂 onboarding/               # Step 1: Patient Information Entry
│   │   └── page.tsx                 # Patient demographic form
│   │
│   ├── 📂 patient/                  # Patient registration & selection
│   │   └── page.tsx                 # Create/edit patient records
│   │
│   ├── 📂 calibration/              # Step 2: Audio Device Calibration
│   │   └── page.tsx                 # Calibration wizard & setup
│   │
│   ├── 📂 test/                     # Step 3: Pure Tone Audiometry Test
│   │   └── page.tsx                 # Main hearing test interface (2 minutes)
│   │
│   ├── 📂 summary/                  # Step 4: Results & Reports
│   │   └── page.tsx                 # Audiogram visualization & PDF export
│   │
│   └── 📂 reports/                  # Test History & Archive
│       ├── page.tsx                 # View all past sessions
│       └── 📂 [id]/
│           └── page.tsx             # Individual session details
│
├── 📂 components/                   # React Components (Reusable UI)
│   ├── 📂 ui/                       # shadcn/ui Components (pre-built)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── slider.tsx
│   │   ├── progress.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── alert.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   └── ... (70+ other UI components)
│   │
│   ├── theme-provider.tsx           # Dark mode & theme configuration
│   │
│   ├── 🎧 Audio Components
│   │   ├── calibration-card.tsx     # Device calibration UI card
│   │   ├── response-pad.tsx         # User response buttons (keyboard + mouse)
│   │   └── test-controller.tsx      # Main test logic orchestrator
│   │
│   ├── 📊 Results Components
│   │   ├── audiogram-chart.tsx      # Visual audiogram graph (Recharts)
│   │   ├── hearing-summary.tsx      # PTA results & interpretation
│   │   └── test-progress.tsx        # Progress bar during testing
│   │
│   ├── 👥 Patient Components
│   │   ├── session-card.tsx         # Past test session card
│   │   └── reports-filter.tsx       # Search & filter past tests
│   │
│   ├── 📱 PWA Components
│   │   ├── pwa-install.tsx          # Install app prompt
│   │   └── offline-indicator.tsx    # Shows offline status
│   │
│   └── 🎨 Layout Components
│       └── (Used across multiple pages)
│
├── 📂 lib/                          # Core Business Logic & Utilities
│   ├── types.ts                     # TypeScript interfaces (Patient, Session, Threshold, etc.)
│   ├── utils.ts                     # Helper functions (UUID generator, cn() for classNames)
│   ├── store.ts                     # Zustand global state management
│   ├── storage.ts                   # IndexedDB persistence layer
│   │
│   ├── 🎧 Audio Engine
│   │   ├── audio-engine.ts          # Web Audio API wrapper (tone generation)
│   │   ├── calibration.ts           # Device calibration algorithm
│   │   └── hughson-westlake.ts      # Pure tone staircase algorithm (1 reversal, 2 min)
│   │
│   ├── 📊 Analytics & Visualization
│   │   ├── audiogram-utils.ts       # Calculate PTA, interpret results
│   │   └── pdf-generator.ts         # Generate PDF reports with multi-page support
│   │
│   └── 📝 Data Management
│       └── (Utilities for CRUD operations)
│
├── 📂 hooks/                        # React Custom Hooks
│   ├── use-mobile.ts                # Detect mobile device
│   └── use-toast.ts                 # Toast notification hook
│
├── 📂 public/                       # Static Assets
│   ├── icon-192.png                 # PWA icon (small)
│   ├── icon-512.png                 # PWA icon (large)
│   ├── manifest.json                # PWA manifest
│   ├── sw.js                        # Service Worker for offline support
│   ├── placeholder-logo.svg         # App logo
│   └── placeholder.svg              # Placeholder images
│
├── 📂 styles/                       # Stylesheets
│   └── globals.css                  # Global Tailwind styles
│
├── 📂 user_read_only_context/       # Documentation & Examples
│   ├── text_attachments/            # Reference files
│   └── integration_examples/        # Component examples
│
├── 🔧 Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── next.config.mjs              # Next.js config (PWA, compression)
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── postcss.config.mjs           # CSS processing
│   └── components.json              # shadcn/ui config
│
├── 📚 Documentation Files
│   ├── README.md                    # Main project readme
│   ├── START_HERE.md                # Quick start guide
│   ├── EXACT_COMMANDS_TO_RUN.md     # CMD commands
│   ├── PROJECT_STRUCTURE_AND_WORKFLOW.md  # This file
│   ├── FIXES_AND_IMPROVEMENTS_SUMMARY.md  # What was fixed
│   ├── PROJECT_EXECUTION_WORKFLOW.html    # Visual workflow diagram
│   └── DATAFLOW_DIAGRAM.html        # Data flow visualization
│
└── 📋 Misc Files
    ├── .gitignore                   # Git ignore rules
    ├── pnpm-lock.yaml               # Dependency lock file
    ├── RUN_APP.bat                  # Windows batch script
    └── run_app.sh                   # Linux/Mac shell script
\`\`\`

---

## 🔄 PROJECT WORKFLOW EXECUTION TREE

\`\`\`
START
│
├─ User Opens App (http://localhost:3000)
│  │
│  ├─ [index] Load app/layout.tsx
│  │   ├─ Register Service Worker (PWA support)
│  │   ├─ Load fonts & global styles
│  │   ├─ Initialize ThemeProvider (dark mode)
│  │   └─ Initialize Zustand store
│  │
│  └─ Render app/page.tsx (HOME PAGE)
│     ├─ Display welcome message
│     ├─ Show app features
│     └─ Button: "Start New Test" → Navigate to /onboarding
│
├─ STEP 1: ONBOARDING - Patient Information (app/onboarding/page.tsx)
│  │  Purpose: Collect patient demographics
│  │
│  ├─ Render Form Fields
│  │   ├─ First Name (TextInput)
│  │   ├─ Last Name (TextInput)
│  │   ├─ Date of Birth (DateInput)
│  │   ├─ Sex/Gender (RadioGroup)
│  │   ├─ Medical Record Number (TextInput)
│  │   └─ Notes (TextArea)
│  │
│  ├─ User Submits Form
│  │   ├─ Validate all fields
│  │   ├─ Call utils.ts → generateUUID() → Create patient ID
│  │   ├─ Call store.ts → setPatient() → Save to Zustand
│  │   ├─ Call storage.ts → savePatient() → Save to IndexedDB
│  │   └─ Show success toast
│  │
│  └─ Navigate to /patient → Next page
│
├─ SELECT PATIENT (app/patient/page.tsx)
│  │  Purpose: Choose existing patient or create new
│  │
│  ├─ Load all patients from IndexedDB (storage.ts)
│  ├─ Display PatientList
│  │   ├─ Show each patient in PatientCard
│  │   ├─ Click to select
│  │   └─ Button: "Create New Patient" → /onboarding
│  │
│  └─ Navigate to /calibration → Next page
│
├─ STEP 2: CALIBRATION (app/calibration/page.tsx)
│  │  Purpose: Setup audio device & calibrate
│  │
│  ├─ Load calibration.ts module
│  │   └─ Initialize audio context
│  │
│  ├─ Display CalibrationWizard
│  │   ├─ Step 1: Select Headphones
│  │   │   ├─ Dropdown with existing calibrations
│  │   │   ├─ Or enter new device name (e.g., "Sony WH-1000XM5")
│  │   │   └─ Save device profile to store
│  │   │
│  │   ├─ Step 2: Channel Test (L/R)
│  │   │   ├─ Play 1kHz tone at 60dB in LEFT ear
│  │   │   ├─ User confirms hearing
│  │   │   ├─ Play 1kHz tone at 60dB in RIGHT ear
│  │   │   ├─ User confirms hearing
│  │   │   └─ Store in CalibrationProfile
│  │   │
│  │   ├─ Step 3: Volume Reference
│  │   │   ├─ Play 1kHz test tone
│  │   │   ├─ Slider: Adjust to "Comfortably Loud"
│  │   │   ├─ Calculate reference dB level
│  │   │   └─ Save outputGain to calibration.ts
│  │   │
│  │   ├─ Step 4: Frequency-Specific Calibration
│  │   │   ├─ For each frequency: 250, 500, 1k, 2k, 4k, 8k Hz
│  │   │   ├─ Play tone at reference level
│  │   │   ├─ Slider: Adjust if output seems different
│  │   │   ├─ Store adjustDb per frequency
│  │   │   └─ Save all to CalibrationPoint[]
│  │   │
│  │   └─ Button: "Calibration Complete" ✓
│  │
│  ├─ Store CalibrationProfile to:
│  │   ├─ store.ts (Zustand state)
│  │   └─ storage.ts (IndexedDB)
│  │
│  └─ Navigate to /test → Next page
│
├─ STEP 3: PURE TONE AUDIOMETRY TEST (app/test/page.tsx) ⭐ MAIN TEST
│  │  Purpose: Measure hearing thresholds (2 minutes optimized)
│  │
│  ├─ Initialize Test Session
│  │   ├─ Get patient & calibration from store
│  │   ├─ Load hughson-westlake.ts algorithm
│  │   ├─ Create Session object
│  │   ├─ Start timer
│  │   └─ Show TestProgress component
│  │
│  ├─ Test Loop: For Each Ear (Left, then Right)
│  │   │
│  │   ├─ Test Loop: For Each Frequency (1k, 2k, 4k, 500 Hz - 4 only)
│  │   │   │
│  │   │   ├─ Initialize Staircase Algorithm (hughson-westlake.ts)
│  │   │   │   ├─ startingLevel = 50 dB (or patient history)
│  │   │   │   ├─ stepSize = 10 dB initially, then 5 dB after 1st reversal
│  │   │   │   ├─ direction = "down" (start too loud, go quieter)
│  │   │   │   └─ Complete after 1 reversal (fast)
│  │   │   │
│  │   │   ├─ Play Tone Loop: Until Threshold Found
│  │   │   │   │
│  │   │   │   ├─ audio-engine.ts → playTone()
│  │   │   │   │   ├─ Create OscillatorNode at frequency
│  │   │   │   │   ├─ Apply calibration (CalibrationProfile adjustments)
│  │   │   │   │   ├─ Add envelope (attack, sustain, release)
│  │   │   │   │   ├─ Pan to correct ear (L or R)
│  │   │   │   │   ├─ Duration: 1-2 seconds
│  │   │   │   │   └─ Play through Web Audio API
│  │   │   │   │
│  │   │   │   ├─ ResponsePad Component Shows
│  │   │   │   │   ├─ Large "I HEARD" button (mouse + spacebar)
│  │   │   │   │   ├─ Countdown timer
│  │   │   │   │   └─ Current level display (dB)
│  │   │   │   │
│  │   │   │   ├─ Wait for User Response (or timeout after 3 sec)
│  │   │   │   │   ├─ IF user clicks → heard = true
│  │   │   │   │   └─ IF timeout → heard = false
│  │   │   │   │
│  │   │   │   ├─ Staircase Algorithm → addResponse()
│  │   │   │   │   ├─ Record: {levelDb, heard}
│  │   │   │   │   ├─ IF heard & going down → continue down
│  │   │   │   │   ├─ IF heard & going up → REVERSE, go down
│  │   │   │   │   ├─ IF not heard → change direction
│  │   │   │   │   ├─ Adjust levelDb by stepSize
│  │   │   │   │   └─ Check if complete (1 reversal reached?)
│  │   │   │   │
│  │   │   │   └─ Loop back OR Continue to next frequency
│  │   │   │
│  │   │   ├─ Calculate Threshold for This Frequency
│  │   │   │   ├─ Get final level = avgDb of last reversals
│  │   │   │   ├─ Store in Threshold object:
│  │   │   │   │   {ear: "Left", freqHz: 1000, thresholdDb: 28, trials: [...]}
│  │   │   │   └─ Add to store.session.thresholds[]
│  │   │   │
│  │   │   ├─ Play 2-sec pause
│  │   │   │
│  │   │   └─ Next Frequency (or Ear)
│  │   │
│  │   └─ Next Ear (Right if just did Left)
│  │
│  ├─ Test Complete!
│  │   ├─ Calculate PTA (Pure Tone Average) for each ear
│  │   │   └─ PTA = (threshold@1k + threshold@2k + threshold@3k) / 3
│  │   ├─ Interpret hearing loss level (Normal/Mild/Moderate/etc.)
│  │   ├─ Save Session to store & IndexedDB
│  │   ├─ Stop timer
│  │   └─ Show "Test Complete" dialog
│  │
│  └─ Navigate to /summary → Results page
│
├─ STEP 4: RESULTS & REPORT (app/summary/page.tsx)
│  │  Purpose: View results, audiogram, and export PDF
│  │
│  ├─ Load session data from store
│  │
│  ├─ Display Results Card
│  │   ├─ Patient name & test date/time
│  │   ├─ Test duration (should be ~2 min)
│  │   └─ Current ear/frequency being displayed
│  │
│  ├─ Display AudiogramChart Component
│  │   ├─ Recharts graph showing:
│  │   │   ├─ X-axis: Frequencies (500, 1k, 2k, 4k Hz)
│  │   │   ├─ Y-axis: Hearing level (0-120 dB, inverted)
│  │   │   ├─ RIGHT EAR: Red circles (connected)
│  │   │   ├─ LEFT EAR: Blue X marks (connected)
│  │   │   └─ Reference lines for Normal/Mild/Moderate/etc.
│  │   │
│  │   └─ Recharts renders using Canvas/SVG
│  │
│  ├─ Display HearingSummary Component
│  │   ├─ PTA Left Ear
│  │   ├─ PTA Right Ear
│  │   ├─ Interpretation (Audiogram type, etc.)
│  │   ├─ Editable Threshold Table
│  │   │   ├─ Each threshold cell is editable
│  │   │   ├─ User can manually adjust if needed
│  │   │   └─ Changes update store & chart in real-time
│  │   └─ Clinical notes
│  │
│  ├─ Buttons
│  │   ├─ "Generate PDF Report" → Trigger pdf-generator.ts
│  │   │   ├─ html2canvas (convert chart to image)
│  │   │   ├─ pdf-lib (create PDF)
│  │   │   ├─ Add pages with auto text wrapping:
│  │   │   │   ├─ Page 1: Patient info, Results summary
│  │   │   │   ├─ Page 2: Audiogram chart (image)
│  │   │   │   ├─ Page 3: Threshold table
│  │   │   │   ├─ Page 4: Interpretation & recommendations
│  │   │   │   └─ Final: Medical disclaimer
│  │   │   ├─ Download PDF file
│  │   │   └─ Toast: "PDF Generated Successfully"
│  │   │
│  │   ├─ "Save Report" → storage.ts → IndexedDB
│  │   ├─ "New Test" → Back to /onboarding
│  │   └─ "View History" → Navigate to /reports
│  │
│  └─ (Optional) Share → Android/iOS share API
│
├─ HISTORY & ARCHIVE (app/reports/page.tsx)
│  │  Purpose: View all past tests
│  │
│  ├─ Load all sessions from IndexedDB (storage.ts)
│  ├─ Display ReportsFilter
│  │   ├─ Search by patient name
│  │   ├─ Filter by date range
│  │   ├─ Sort by recent/oldest
│  │   └─ Show results count
│  │
│  ├─ Display SessionCard List
│  │   ├─ Each card shows:
│  │   │   ├─ Patient name
│  │   │   ├─ Test date & duration
│  │   │   ├─ PTA Left/Right
│  │   │   ├─ Interpretation
│  │   │   └─ Click to open details
│  │   │
│  │   └─ Click → Navigate to /reports/[id]
│  │
│  └─ [id]/page.tsx → Full Report Details (same as Summary page)
│
└─ END - User can:
   ├─ Start new test
   ├─ View past results
   ├─ Generate PDFs
   └─ Export data

\`\`\`

---

## 🎯 DATA FLOW ARCHITECTURE

\`\`\`
USER INPUT
    ↓
┌─────────────────────────────────────────────┐
│         app/page.tsx (Router)               │ Decides which page to show
│  - Determines current route                 │
│  - Calls navigation functions               │
└──────────────────┬──────────────────────────┘
                   ↓
        ┌──────────────────────┐
        │  PAGE COMPONENT      │ (e.g., app/test/page.tsx)
        │  - Renders UI        │ Orchestrates the page
        │  - Handles events    │ Calls business logic
        │  - Manages local     │
        │    state (useState)  │
        └──────────────┬───────┘
                       ↓
    ┌──────────────────────────────────────┐
    │    COMPONENTS TREE                   │ Builds UI hierarchy
    │  - test-controller.tsx               │ Reusable components
    │  - response-pad.tsx                  │ Modular structure
    │  - test-progress.tsx                 │
    │  - ui/button, card, etc.             │
    └──────────────────┬────────────────────┘
                       ↓
    ┌──────────────────────────────────────┐
    │    CUSTOM HOOKS (hooks/)             │ State management
    │  - use-toast.ts                      │ Cross-component
    │  - use-mobile.ts                     │ Shared logic
    └──────────────────┬────────────────────┘
                       ↓
    ┌──────────────────────────────────────┐
    │    ZUSTAND STORE (lib/store.ts)      │ Global state
    │  - setPatient()                      │ Centralized data
    │  - setSession()                      │ Accessible anywhere
    │  - getState()                        │
    │  - subscribe()                       │
    └──────────────────┬────────────────────┘
                       ↓
    ┌──────────────────────────────────────┐
    │    BUSINESS LOGIC (lib/)             │ Core algorithms
    │  - hughson-westlake.ts               │ Pure functions
    │  - audio-engine.ts                   │ No side effects
    │  - audiogram-utils.ts                │ Testable
    │  - calibration.ts                    │
    │  - pdf-generator.ts                  │
    └──────────────────┬────────────────────┘
                       ↓
    ┌──────────────────────────────────────┐
    │    STORAGE LAYER (lib/storage.ts)    │ Data persistence
    │  - IndexedDB via Dexie               │ Browser database
    │  - savePatient()                     │ Offline-capable
    │  - saveSession()                     │ CRUD operations
    │  - loadPatients()                    │
    └──────────────────┬────────────────────┘
                       ↓
    ┌──────────────────────────────────────┐
    │    FILE SYSTEM / BROWSER API         │ External I/O
    │  - IndexedDB (browser storage)       │ File downloads
    │  - Web Audio API (playback)          │ Service Worker
    │  - Canvas API (charts)               │
    │  - Navigator (geolocation, etc.)     │
    └──────────────────────────────────────┘
\`\`\`

---

## 📁 KEY FILE LOCATIONS BY PURPOSE

| Purpose | File Location | Description |
|---------|---------------|-------------|
| **ENTRY POINT** | `app/layout.tsx` | Root layout, PWA setup, font loading |
| **HOME PAGE** | `app/page.tsx` | Welcome screen, app intro |
| **PATIENT INFO** | `app/onboarding/page.tsx` | Demographic form |
| **PATIENT SELECTION** | `app/patient/page.tsx` | Select/create patient |
| **DEVICE SETUP** | `app/calibration/page.tsx` | Audio device calibration |
| **HEARING TEST** | `app/test/page.tsx` | Main 2-minute audiometry test |
| **RESULTS** | `app/summary/page.tsx` | Audiogram & PDF export |
| **HISTORY** | `app/reports/page.tsx` | Past test archive |
| **SINGLE REPORT** | `app/reports/[id]/page.tsx` | Detailed test report |
| **DATA TYPES** | `lib/types.ts` | TypeScript interfaces |
| **GLOBAL STATE** | `lib/store.ts` | Zustand store |
| **DATABASE** | `lib/storage.ts` | IndexedDB CRUD |
| **AUDIO ENGINE** | `lib/audio-engine.ts` | Web Audio API wrapper |
| **TEST ALGORITHM** | `lib/hughson-westlake.ts` | Staircase threshold detection |
| **CALIBRATION** | `lib/calibration.ts` | Device calibration |
| **RESULTS CALC** | `lib/audiogram-utils.ts` | PTA & interpretation |
| **PDF EXPORT** | `lib/pdf-generator.ts` | Report generation |
| **UTILITIES** | `lib/utils.ts` | Helper functions (UUID, etc.) |
| **UI COMPONENTS** | `components/ui/*.tsx` | shadcn/ui prebuilt components |
| **CUSTOM COMPONENTS** | `components/*.tsx` | App-specific components |
| **STYLES** | `app/globals.css` | Tailwind + design tokens |
| **CONFIG** | `next.config.mjs` | Next.js settings |
| **PACKAGES** | `package.json` | Dependencies |

---

## ⚙️ HOW COMPONENTS COMMUNICATE

\`\`\`
app/test/page.tsx (Main Page)
    │
    ├─ imports → test-controller.tsx
    │           imports → response-pad.tsx
    │           imports → test-progress.tsx
    │           imports → ui/button.tsx, ui/card.tsx, etc.
    │
    ├─ imports → lib/hughson-westlake.ts (algorithm)
    ├─ imports → lib/audio-engine.ts (sound)
    ├─ imports → lib/store.ts (read/write global state)
    │
    └─ Event Flow:
        1. User clicks "Start Test"
        2. test-controller.tsx initializes algorithm
        3. Audio plays via audio-engine.ts
        4. response-pad.tsx shows button
        5. User clicks button
        6. response-pad.tsx calls onResponse()
        7. test-controller.tsx updates algorithm
        8. test-progress.tsx re-renders with new progress
        9. Zustand store updated
        10. IndexedDB saves session
        11. Next tone plays... (repeat)
\`\`\`

---

## 🚀 STARTUP SEQUENCE

When user opens http://localhost:3000:

\`\`\`
1. Browser loads index.html
2. Next.js renders app/layout.tsx
   ├─ Registers Service Worker (PWA)
   ├─ Loads fonts (Geist)
   ├─ Initializes Zustand store
   ├─ Sets up Dark Mode
   └─ Renders children
3. app/page.tsx renders (homepage)
4. User clicks "Start Test"
5. Navigate to /onboarding → app/onboarding/page.tsx
6. Continue through workflow...
\`\`\`

---

## 📊 STATE MANAGEMENT FLOW

\`\`\`
Zustand Store (lib/store.ts)
├─ Patient: Patient object (selected)
├─ Session: Session object (current test)
├─ Calibration: CalibrationProfile (device settings)
├─ Thresholds: Threshold[] (test results)
├─ TestState: { isRunning, currentEar, currentFreq, etc. }
└─ UI State: { darkMode, sidebarOpen, etc. }

Any component can:
├─ GET: const state = useStore() → read
├─ SET: useStore.setState({...}) → write
└─ WATCH: const unsub = useStore.subscribe(() => {...}) → listen for changes
\`\`\`

---

## 🔐 DATA PERSISTENCE FLOW

\`\`\`
User submits form
    ↓
store.ts → setPatient(data) [Memory]
    ↓
storage.ts → savePatient(data) [IndexedDB - Permanent]
    ↓
(On page reload)
    ↓
storage.ts → loadPatients() [IndexedDB → Memory]
    ↓
store.ts → setPatient(data) [Back in memory]
    ↓
Component reads from store
\`\`\`

---

## ✅ CHECKLIST: FILES TO MODIFY WHEN ADDING FEATURES

1. **New data type?** → Add to `lib/types.ts`
2. **New global state?** → Update `lib/store.ts`
3. **New page route?** → Create `app/newpage/page.tsx`
4. **New component?** → Create `components/new-component.tsx`
5. **New business logic?** → Create `lib/new-logic.ts`
6. **Database table?** → Update `lib/storage.ts`
7. **Styling needed?** → Update `app/globals.css` or component's `className`
8. **Dependencies?** → Update `package.json` (then `npm install`)

---

## 🎓 LEARNING PATH

**For beginners:**
1. Start with `app/page.tsx` - understand page structure
2. Then `components/ui/button.tsx` - understand components
3. Then `lib/types.ts` - understand data types
4. Then `lib/store.ts` - understand state management

**For intermediate:**
1. Study `app/test/page.tsx` - complex page logic
2. Study `lib/hughson-westlake.ts` - algorithm implementation
3. Study `lib/audio-engine.ts` - Web Audio API usage

**For advanced:**
1. Study `lib/storage.ts` - IndexedDB operations
2. Study `lib/pdf-generator.ts` - PDF generation
3. Study `public/sw.js` - Service Worker caching
