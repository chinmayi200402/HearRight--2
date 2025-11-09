# HearRight - Quick Reference Guide

## 🚀 Quick Start Commands

### For First Time Setup
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:3000
\`\`\`

### Running the App
\`\`\`bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm run start

# Check for errors
npm run build  # If no errors appear, build is successful
\`\`\`

---

## 📁 Key Files Quick Access

### Pages (Routes)
| Page | File | Purpose |
|------|------|---------|
| Home | \`app/page.tsx\` | Welcome screen |
| Onboarding | \`app/onboarding/page.tsx\` | Patient demographics |
| Patient Select | \`app/patient/page.tsx\` | Choose patient |
| Calibration | \`app/calibration/page.tsx\` | Audio setup |
| Test | \`app/test/page.tsx\` | Hearing test (2 min) |
| Results | \`app/summary/page.tsx\` | Audiogram & PDF |
| History | \`app/reports/page.tsx\` | Past tests |
| Report Detail | \`app/reports/[id]/page.tsx\` | Single test detail |

### Core Logic Files
| File | Purpose | Key Functions |
|------|---------|---------------|
| \`lib/types.ts\` | Data types | Patient, Session, Threshold |
| \`lib/store.ts\` | Global state | setPatient(), setSession() |
| \`lib/storage.ts\` | Database | savePatient(), loadSession() |
| \`lib/hughson-westlake.ts\` | Test algorithm | Staircase method |
| \`lib/audio-engine.ts\` | Sound generation | playTone(), stopTone() |
| \`lib/calibration.ts\` | Device setup | Calibration profile |
| \`lib/audiogram-utils.ts\` | Results analysis | calculatePTA(), interpret() |
| \`lib/pdf-generator.ts\` | Report export | generatePDF() |
| \`lib/utils.ts\` | Helpers | generateUUID(), cn() |

### Components
| File | Purpose | Used In |
|------|---------|---------|
| \`components/test-controller.tsx\` | Test orchestrator | app/test/page.tsx |
| \`components/response-pad.tsx\` | User input buttons | test-controller.tsx |
| \`components/audiogram-chart.tsx\` | Visual graph | app/summary/page.tsx |
| \`components/calibration-card.tsx\` | Calibration card | app/calibration/page.tsx |
| \`components/hearing-summary.tsx\` | Results summary | app/summary/page.tsx |
| \`components/session-card.tsx\` | Test history card | app/reports/page.tsx |
| \`components/test-progress.tsx\` | Progress bar | app/test/page.tsx |

---

## 🔧 Configuration Files

### Environment & Build
- \`package.json\` - Dependencies and scripts
- \`next.config.mjs\` - Next.js configuration
- \`tsconfig.json\` - TypeScript settings
- \`tailwind.config.ts\` - Tailwind CSS settings
- \`.gitignore\` - Git ignore rules

### Styling
- \`app/globals.css\` - Global styles + Tailwind + design tokens
- \`postcss.config.mjs\` - CSS processing

### PWA & Offline
- \`public/manifest.json\` - PWA manifest
- \`public/sw.js\` - Service Worker (offline support)
- \`public/icon-192.png\` - PWA icon
- \`public/icon-512.png\` - PWA icon

---

## 🎯 Common Tasks

### Add a New Page
\`\`\`bash
# 1. Create file: app/newpage/page.tsx
# 2. Add route logic
# 3. Components auto-imported from \`components/\`
# 4. Data from \`lib/store.ts\`
\`\`\`

### Add a New Component
\`\`\`bash
# 1. Create: components/new-component.tsx
# 2. Import in page: import NewComponent from '@/components/new-component'
# 3. Use: <NewComponent />
\`\`\`

### Add New Data Field
\`\`\`bash
# 1. Update type in \`lib/types.ts\`
# 2. Update store in \`lib/store.ts\`
# 3. Update storage in \`lib/storage.ts\`
# 4. Update components using the data
\`\`\`

### Modify Styles
\`\`\`bash
# Global: Edit \`app/globals.css\`
# Component: Edit className in \`components/component.tsx\`
# Use Tailwind classes: \`className="flex items-center justify-between"\`
\`\`\`

### Debug Issues
\`\`\`bash
# Check console errors: Browser F12 → Console
# Check network: Browser F12 → Network
# Check storage: Browser F12 → Application → IndexedDB
# Check offline: Browser F12 → Network → Offline
\`\`\`

---

## 💾 Data Flow Cheat Sheet

\`\`\`
User Action (Click Button)
    ↓
Component Event Handler
    ↓
Zustand Store → store.ts
    ↓
IndexedDB → storage.ts
    ↓
Component Re-renders
    ↓
UI Updated
\`\`\`

---

## 🧪 Test the App

### Test Patient Registration
1. Go to http://localhost:3000
2. Click "Start New Test"
3. Fill patient form → Submit
4. Patient saved to browser database ✓

### Test Audio Test
1. Complete calibration
2. Click "Start Test"
3. Listen for tones
4. Click "I Heard" when you hear
5. See results in summary ✓

### Test PDF Export
1. Complete test
2. Go to Summary page
3. Click "Generate PDF Report"
4. File downloads ✓

### Test Offline
1. Browser F12 → Network → Check "Offline"
2. App still works (UI, navigation)
3. Data saved locally (IndexedDB)
4. Go online → Data synced ✓

---

## 📊 Workflow Quick Map

\`\`\`
Home → Onboarding → Patient → Calibration → Test → Summary → Reports
  ↓
  └─→ (Can return to any step)
\`\`\`

### During Test Flow
\`\`\`
app/test/page.tsx
  → test-controller.tsx (Manages test)
  → hughson-westlake.ts (Algorithm)
  → audio-engine.ts (Play tone)
  → response-pad.tsx (User clicks)
  → Update store
  → Update IndexedDB
  → Repeat for each tone
  → Navigate to /summary
\`\`\`

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | \`npm run dev -- -p 3001\` |
| Blank page | Press F12, check console for errors |
| No audio | Check browser audio permissions |
| Data not saving | Check IndexedDB in DevTools |
| Offline not working | Check Service Worker in DevTools |
| Slow performance | Run \`npm run build\` to optimize |

---

## 📈 Performance Tips

- **Dev Mode**: Slower but shows live updates
- **Production Build**: Faster but requires rebuild
- **Bundle Size**: ~2.5 MB (Next.js + dependencies)
- **Load Time**: ~2-3 seconds first load
- **Offline Cache**: All assets cached by Service Worker

---

## 🔐 Security Notes

- Patient data stored locally (browser)
- No data sent to server
- HTTPS required for production
- RLS (Row Level Security) can be added if backend added
- PDF export is client-side only

---

## 📞 Need Help?

1. Check browser console (F12 → Console)
2. Check network errors (F12 → Network)
3. Check IndexedDB data (F12 → Application)
4. Check Service Worker (F12 → Application → Service Workers)
5. Restart dev server: Ctrl+C, then \`npm run dev\`
