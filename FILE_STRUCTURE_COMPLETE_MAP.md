# 📂 HearRight - Complete File Structure Map

## Directory Tree with Descriptions

\`\`\`
hearright/
│
│ 🏠 HOME PAGE ROUTES
├── app/
│   ├── layout.tsx                      ⭐ Root layout (PWA, fonts, providers)
│   ├── page.tsx                        🏠 Home/welcome page
│   ├── globals.css                     🎨 Global Tailwind + design tokens
│   │
│   │ 📄 PAGE ROUTES (Each becomes a URL)
│   ├── onboarding/
│   │   └── page.tsx                    👤 Patient demographic form
│   │
│   ├── patient/
│   │   └── page.tsx                    👥 Patient selection/creation
│   │
│   ├── calibration/
│   │   └── page.tsx                    🎧 Audio device calibration wizard
│   │
│   ├── test/
│   │   └── page.tsx                    🔊 Main 2-minute hearing test
│   │
│   ├── summary/
│   │   └── page.tsx                    📊 Results, audiogram, PDF export
│   │
│   └── reports/
│       ├── page.tsx                    📁 View all past tests
│       └── [id]/
│           └── page.tsx                📄 Individual test detail view
│
│
│ 🧩 REUSABLE COMPONENTS
├── components/
│   │
│   │ 🎨 UI LIBRARY (shadcn/ui - Pre-built)
│   ├── ui/
│   │   ├── button.tsx                  Basic button component
│   │   ├── card.tsx                    Card container
│   │   ├── badge.tsx                   Badge/label
│   │   ├── slider.tsx                  Slider input
│   │   ├── progress.tsx                Progress bar
│   │   ├── input.tsx                   Text input
│   │   ├── textarea.tsx                Text area input
│   │   ├── alert.tsx                   Alert message
│   │   ├── dialog.tsx                  Modal dialog
│   │   ├── tabs.tsx                    Tab navigation
│   │   ├── table.tsx                   Data table
│   │   ├── form.tsx                    Form wrapper
│   │   ├── label.tsx                   Form label
│   │   ├── checkbox.tsx                Checkbox input
│   │   ├── radio-group.tsx             Radio button
│   │   ├── select.tsx                  Dropdown select
│   │   ├── tooltip.tsx                 Hover tooltip
│   │   ├── popover.tsx                 Popup menu
│   │   ├── scroll-area.tsx             Scrollable area
│   │   ├── separator.tsx               Divider line
│   │   ├── skeleton.tsx                Loading skeleton
│   │   ├── spinner.tsx                 Loading spinner
│   │   ├── toast.tsx                   Toast notification
│   │   ├── toaster.tsx                 Toast container
│   │   ├── use-toast.ts                Toast hook
│   │   ├── use-mobile.tsx              Mobile detection hook
│   │   └── ... (70+ total shadcn components)
│   │
│   │ 🎧 AUDIO TEST COMPONENTS
│   ├── test-controller.tsx             🎮 Main test orchestrator
│   ├── response-pad.tsx                👆 Response buttons + keyboard
│   ├── test-progress.tsx               📈 Progress bar during test
│   │
│   │ 📊 RESULTS COMPONENTS
│   ├── audiogram-chart.tsx             📉 Visual audiogram graph
│   ├── hearing-summary.tsx             📋 Results summary with PTA
│   │
│   │ 🏥 PATIENT/ADMIN COMPONENTS
│   ├── calibration-card.tsx            🎧 Calibration status card
│   ├── session-card.tsx                📝 Past test session card
│   ├── reports-filter.tsx              🔍 Search/filter component
│   │
│   │ 📱 PWA COMPONENTS
│   ├── pwa-install.tsx                 📥 App install prompt
│   ├── offline-indicator.tsx           ⚠️ Offline status indicator
│   │
│   │ 🎨 LAYOUT COMPONENTS
│   └── theme-provider.tsx              🌓 Dark mode provider
│
│
│ 🧠 BUSINESS LOGIC & UTILITIES
├── lib/
│   ├── types.ts                        📋 TypeScript data types
│   │   ├── Patient interface
│   │   ├── Session interface
│   │   ├── Threshold interface
│   │   ├── CalibrationProfile interface
│   │   └── Constants (frequencies, hearing loss ranges)
│   │
│   ├── store.ts                        💾 Zustand global state store
│   │   ├── setPatient()
│   │   ├── setSession()
│   │   ├── getState()
│   │   └── subscribe() for listeners
│   │
│   ├── storage.ts                      🗄️ IndexedDB database layer
│   │   ├── savePatient()
│   │   ├── loadPatient()
│   │   ├── saveSession()
│   │   ├── loadSession()
│   │   ├── getAllSessions()
│   │   └── deleteSession()
│   │
│   │ 🎧 AUDIO ENGINE
│   ├── audio-engine.ts                 🔊 Web Audio API wrapper
│   │   ├── playTone()
│   │   ├── stopTone()
│   │   ├── setGain()
│   │   └── applyCalibration()
│   │
│   │ 📐 ALGORITHMS
│   ├── hughson-westlake.ts             🎯 Pure tone staircase algorithm
│   │   ├── HughsonWestlakeStaircase class
│   │   ├── addResponse()
│   │   ├── isComplete()
│   │   └── getThreshold()
│   │
│   ├── calibration.ts                  🔧 Device calibration logic
│   │   ├── calibrateDevice()
│   │   ├── calculateGain()
│   │   └── validateCalibration()
│   │
│   │ 📊 ANALYTICS
│   ├── audiogram-utils.ts              📈 Results calculation
│   │   ├── calculatePTA()
│   │   ├── interpretHearingLoss()
│   │   ├── validateThreshold()
│   │   └── formatResults()
│   │
│   │ 📄 EXPORT
│   ├── pdf-generator.ts                📃 PDF report generation
│   │   ├── generatePDF()
│   │   ├── addTextWithWrapping()
│   │   ├── drawAudiogram()
│   │   └── formatPatientInfo()
│   │
│   │ 🛠️ UTILITIES
│   ├── utils.ts                        ⚙️ Helper functions
│   │   ├── generateUUID()
│   │   ├── cn() - class name helper
│   │   ├── formatDate()
│   │   └── parseJSON()
│   │
│   └── (other utility modules as needed)
│
│
│ 🎣 REACT HOOKS
├── hooks/
│   ├── use-mobile.ts                   📱 Detect mobile device
│   └── use-toast.ts                    🔔 Toast notifications
│
│
│ 🖼️ STATIC ASSETS
├── public/
│   ├── icon-192.png                    🎯 PWA icon (small)
│   ├── icon-512.png                    🎯 PWA icon (large)
│   ├── icon.svg                        🏷️ App icon
│   ├── manifest.json                   📋 PWA web manifest
│   ├── sw.js                           ⚙️ Service Worker (offline)
│   ├── placeholder-logo.svg            🏢 App logo
│   ├── placeholder-logo.png            🏢 App logo (PNG)
│   ├── placeholder.svg                 🖼️ Placeholder image
│   ├── placeholder-user.jpg            👤 Placeholder user image
│   ├── placeholder.jpg                 🖼️ Placeholder image (JPG)
│   └── (other assets)
│
│
│ 🎨 STYLESHEETS
├── styles/
│   └── globals.css                     🌐 Additional global styles
│
│
│ ⚙️ CONFIGURATION FILES
├── package.json                        📦 Dependencies & npm scripts
├── next.config.mjs                     🔧 Next.js configuration
├── tsconfig.json                       🔤 TypeScript configuration
├── tailwind.config.ts                  🎨 Tailwind CSS configuration
├── postcss.config.mjs                  🎨 PostCSS configuration
├── components.json                     🧩 shadcn/ui configuration
├── .gitignore                          🚫 Git ignore patterns
└── pnpm-lock.yaml                      🔒 Dependency lock file
│
│
│ 📚 DOCUMENTATION
├── README.md                           📖 Main readme
├── START_HERE.md                       🚀 Quick start guide
├── EXACT_COMMANDS_TO_RUN.md            💻 CMD commands
├── QUICK_REFERENCE_GUIDE.md            ⚡ Quick reference
├── PROJECT_STRUCTURE_AND_WORKFLOW.md   🏗️ This file
├── FIXES_AND_IMPROVEMENTS_SUMMARY.md   ✅ What was fixed
├── FILE_STRUCTURE_COMPLETE_MAP.md      📂 File map
├── DATAFLOW_DIAGRAM.html               📊 Visual data flow
├── PROJECT_EXECUTION_WORKFLOW.html     🔄 Visual workflow
├── DETAILED_WORKFLOW_VISUALIZATION.html 🎯 Detailed workflow
├── COMPLETE_INSTALLATION_GUIDE.md      📖 Installation guide
├── DATA_FLOW_ARCHITECTURE.md           📡 Architecture details
├── PROJECT_FOLDER_TREE.md              🌳 Folder tree
├── PROJECT_SETUP.md                    🛠️ Setup instructions
└── COMMANDS.md                         ⌨️ Command reference
│
│
│ 🚀 EXECUTABLE SCRIPTS
├── RUN_APP.bat                         🪟 Windows run script
├── run_app.sh                          🐧 Linux/Mac run script
│
│
│ 📖 EXAMPLES & TEMPLATES
└── user_read_only_context/
    ├── text_attachments/               📄 Reference files
    │   ├── app-2zEvN.tsx               (Example app code)
    │   └── pasted-text-BMQx2.txt       (Project requirements)
    └── integration_examples/           📚 Component examples
        └── shadcn_new_components/      (New shadcn components)
            └── shadcn-examples/        (Component docs)
\`\`\`

---

## 🔑 Key File Purposes

### Essential for Running
- \`app/layout.tsx\` - Must have for app to start
- \`app/page.tsx\` - Home page
- \`next.config.mjs\` - Build configuration
- \`package.json\` - Dependencies
- \`tsconfig.json\` - TypeScript setup

### Critical for Testing
- \`app/test/page.tsx\` - Main test page
- \`lib/hughson-westlake.ts\` - Test algorithm
- \`lib/audio-engine.ts\` - Audio generation
- \`components/test-controller.tsx\` - Test logic

### Critical for Results
- \`app/summary/page.tsx\` - Results display
- \`components/audiogram-chart.tsx\` - Graph visualization
- \`lib/audiogram-utils.ts\` - Calculations
- \`lib/pdf-generator.ts\` - PDF export

### Critical for Data Persistence
- \`lib/storage.ts\` - Database operations
- \`lib/store.ts\` - State management
- \`lib/types.ts\` - Data structures

---

## 📊 File Statistics

- **Total Files**: 150+
- **Pages**: 8
- **Components**: 85+ (70+ UI + 15+ custom)
- **Utility Modules**: 8
- **Documentation Files**: 12+
- **Configuration Files**: 6
- **Total Lines of Code**: ~15,000+

---

## 🔄 File Update Frequency

**Rarely Changed**
- \`next.config.mjs\`
- \`tsconfig.json\`
- \`package.json\`

**Occasionally Changed**
- \`app/globals.css\`
- \`lib/types.ts\`
- \`components/ui/*\`

**Frequently Changed**
- \`lib/store.ts\`
- \`lib/storage.ts\`
- \`app/**/page.tsx\`
- \`components/*.tsx\`

---

## ✨ File Organization Best Practices

1. **Pages** in \`app/\` - Routes
2. **Components** in \`components/\` - Reusable UI
3. **Logic** in \`lib/\` - Business logic
4. **Hooks** in \`hooks/\` - Custom React hooks
5. **Assets** in \`public/\` - Static files
6. **Config** in root - Setup files
7. **Docs** in root - Documentation
