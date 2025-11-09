# HearRight - Complete Project Folder Structure

\`\`\`
HearRight/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout + PWA setup
│   ├── page.tsx                     # Home page (/)
│   ├── globals.css                  # Global styles + Tailwind config
│   │
│   ├── patient/                     # Patient registration
│   │   └── page.tsx                 # Patient info form (/patient)
│   │
│   ├── onboarding/                  # Environment setup
│   │   └── page.tsx                 # Instructions & checklist (/onboarding)
│   │
│   ├── calibration/                 # Device calibration
│   │   └── page.tsx                 # Calibration wizard (/calibration)
│   │
│   ├── test/                        # Pure tone audiometry
│   │   └── page.tsx                 # Main test page (/test)
│   │
│   ├── summary/                     # Results display
│   │   └── page.tsx                 # Results & PDF gen (/summary)
│   │
│   └── reports/                     # Patient records
│       ├── page.tsx                 # Reports list (/reports)
│       └── [id]/
│           └── page.tsx             # Report detail (/reports/[id])
│
├── lib/                             # Core logic & utilities
│   ├── types.ts                     # TypeScript definitions
│   │   ├── Patient interface
│   │   ├── Session interface
│   │   ├── Threshold interface
│   │   ├── CalibrationProfile
│   │   └── Test frequencies enum
│   │
│   ├── store.ts                     # Zustand state management
│   │   ├── currentPatient state
│   │   ├── currentCalibration state
│   │   ├── currentSession state
│   │   ├── thresholds array
│   │   └── Store actions
│   │
│   ├── utils.ts                     # Utility functions
│   │   ├── cn() - class name merge
│   │   └── generateUUID() - UUID generation
│   │
│   ├── storage.ts                   # IndexedDB management
│   │   ├── Database initialization
│   │   ├── CRUD operations
│   │   ├── Data export/import
│   │   └── Dexie configuration
│   │
│   ├── audio-engine.ts              # Web Audio API wrapper
│   │   ├── AudioContext management
│   │   ├── Tone generation
│   │   ├── Frequency utilities
│   │   ├── Volume control
│   │   └── Stereo panning
│   │
│   ├── calibration.ts               # Device calibration
│   │   ├── CalibrationManager class
│   │   ├── Save/load calibrations
│   │   ├── Frequency adjustments
│   │   └── Interpolation logic
│   │
│   ├── hughson-westlake.ts          # Audiometry algorithm
│   │   ├── HughsonWestlakeStaircase class
│   │   ├── Down-10/up-5 logic
│   │   ├── Reversal tracking
│   │   ├── Threshold calculation
│   │   └── Convergence detection
│   │
│   ├── audiogram-utils.ts           # Calculation utilities
│   │   ├── calculatePTA() - Pure tone average
│   │   ├── getHearingLossDescription()
│   │   ├── formatFrequency()
│   │   └── Classification logic
│   │
│   └── pdf-generator.ts             # PDF report generation
│       ├── PDFReportGenerator class
│       ├── Multi-page support
│       ├── Header/footer rendering
│       ├── Patient info section
│       ├── Threshold table
│       ├── Audiogram visualization
│       ├── PTA results
│       ├── Clinical notes
│       ├── Download/print functions
│       └── Medical disclaimers
│
├── components/                      # React components
│   ├── ui/                          # shadcn/ui components
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── spinner.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── toast.tsx
│   │
│   ├── pwa-install.tsx              # PWA installation prompt
│   ├── offline-indicator.tsx        # Offline status display
│   │
│   ├── calibration-card.tsx         # Calibration UI component
│   ├── response-pad.tsx             # Test response interface
│   ├── test-controller.tsx          # Test logic controller
│   ├── test-progress.tsx            # Progress tracking display
│   │
│   ├── audiogram-chart.tsx          # Audiogram visualization
│   ├── hearing-summary.tsx          # Results summary view
│   │
│   ├── session-card.tsx             # Session card in list
│   └── reports-filter.tsx           # Report filtering UI
│
├── public/                          # Static assets
│   ├── manifest.json                # PWA manifest
│   │   ├── App name & icons
│   │   ├── Start URL
│   │   ├── Display mode
│   │   └── Theme colors
│   │
│   ├── sw.js                        # Service worker
│   │   ├── Cache strategy
│   │   ├── Route handling
│   │   ├── Offline fallback
│   │   └── Update listeners
│   │
│   ├── icon-192.png                 # PWA icon (192x192)
│   ├── icon-512.png                 # PWA icon (512x512)
│   └── placeholder.svg              # Placeholder image
│
├── hooks/                           # Custom React hooks
│   ├── use-mobile.ts                # Mobile detection
│   └── use-toast.ts                 # Toast notifications
│
├── .gitignore                       # Git ignore rules
├── .env.local                       # Local environment vars
├── .env.example                     # Environment template
│
├── next.config.mjs                  # Next.js configuration
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind CSS config (v4)
├── package.json                     # Dependencies & scripts
├── package-lock.json                # Lock file
│
├── README.md                        # Project overview
├── PROJECT_SETUP.md                 # Setup & run guide
├── DATA_FLOW_ARCHITECTURE.md        # Architecture docs
└── PROJECT_FOLDER_TREE.md           # This file

## File Statistics

- Total files: 80+
- React components: 40+
- Pages: 7
- UI components: 25+
- Utility modules: 8
- Configuration files: 5
- Documentation: 4

## Size Breakdown

- Source code: ~8,000 lines
- Configuration: ~500 lines
- Tests: Ready for implementation
- Styles: Tailwind CSS (on-demand)

## Build Artifacts (After npm run build)

\`\`\`
.next/
├── cache/
├── static/
│   ├── chunks/
│   │   ├── app-pages/     # Route chunks
│   │   ├── framework/     # Next.js framework
│   │   └── main/          # Main bundle
│   │
│   └── css/               # Compiled CSS
│
└── BUILD_ID
\`\`\`

## Key Dependencies

\`\`\`json
{
  "dependencies": {
    "next": "15.2.4",
    "react": "19.0.0",
    "typescript": "5.3.3",
    "tailwindcss": "4.0.0",
    "pdf-lib": "1.17.1",
    "zustand": "4.4.0",
    "dexie": "3.2.4",
    "recharts": "2.10.0",
    "lucide-react": "0.263.1",
    "@radix-ui/*": "latest"
  }
}
\`\`\`

---
Last Updated: November 2025
