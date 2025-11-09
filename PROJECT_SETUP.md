# HearRight Project Setup & Run Guide

## Project Overview
HearRight is an AI-based audiometer web application built with Next.js 14+ for hearing health screening using pure-tone audiometry testing combined with ML-based skin disease detection capabilities.

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Windows CMD, macOS Terminal, or Linux bash
- Modern web browser with Web Audio API support

## Installation Steps

### 1. Clone/Extract Project
\`\`\`bash
# Navigate to your project directory
cd HearRight
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

This installs all required packages:
- Next.js 15+
- React 19+
- TypeScript
- Tailwind CSS v4
- pdf-lib (for PDF generation)
- Zustand (state management)
- Dexie (IndexedDB wrapper)
- Recharts (charting library)
- Lucide React (icons)
- shadcn/ui (UI components)

## Running the Application

### Development Mode (Hot Reload)
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`
- Opens at: http://localhost:3000
- Auto-refreshes on file changes
- Best for development

### Production Build & Run
\`\`\`bash
# Build the project
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
\`\`\`
- Optimized build for deployment
- Listen on: http://localhost:3000

### Build Only (without running)
\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## Project Structure

\`\`\`
HearRight/
├── app/
│   ├── layout.tsx           # Root layout with PWA setup
│   ├── globals.css          # Tailwind CSS configuration
│   ├── page.tsx             # Home/landing page
│   ├── patient/             # Patient information entry
│   ├── onboarding/          # Environment setup & instructions
│   ├── calibration/         # Audio device calibration
│   ├── test/                # Pure tone audiometry test
│   ├── summary/             # Results & PDF generation
│   └── reports/             # Patient records & history
│
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   ├── store.ts             # Zustand state management
│   ├── utils.ts             # Utility functions (UUID generator)
│   ├── storage.ts           # IndexedDB storage layer
│   ├── audio-engine.ts      # Web Audio API wrapper
│   ├── calibration.ts       # Device calibration manager
│   ├── hughson-westlake.ts  # Audiometry algorithm
│   ├── audiogram-utils.ts   # Chart utilities & calculations
│   └── pdf-generator.ts     # Multi-page PDF report generation
│
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── pwa-install.tsx      # PWA installation prompt
│   ├── offline-indicator.tsx # Offline status indicator
│   ├── calibration-card.tsx # Calibration UI
│   ├── response-pad.tsx     # Test response interface
│   ├── test-controller.tsx  # Test logic controller
│   ├── test-progress.tsx    # Progress visualization
│   ├── audiogram-chart.tsx  # Audiogram rendering
│   ├── hearing-summary.tsx  # Results summary
│   ├── session-card.tsx     # Patient session card
│   └── reports-filter.tsx   # Report filtering
│
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js               # Service worker
│   ├── icon-192.png        # PWA icon (192x192)
│   └── icon-512.png        # PWA icon (512x512)
│
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript config
├── next.config.mjs         # Next.js configuration
└── README.md              # Project documentation
\`\`\`

## Key Features

### 1. **Pure Tone Audiometry**
- Hughson-Westlake down-10/up-5 staircase algorithm
- 2-minute optimized testing (4 frequencies: 500Hz, 1kHz, 2kHz, 4kHz)
- Automatic ear switching
- Real-time threshold detection

### 2. **Audio Calibration**
- Device-specific calibration profiles
- Frequency-based adjustments
- Master gain control
- Interpolation for non-standard frequencies

### 3. **Data Management**
- IndexedDB offline storage
- Patient record management
- Session history tracking
- Data export/import functionality

### 4. **PDF Report Generation**
- Multi-page reports with auto page breaks
- Professional audiograms with standard symbols
- PTA calculations and interpretations
- Clinical notes and methodology
- Medical disclaimers and footer numbering

### 5. **Progressive Web App (PWA)**
- Offline functionality
- Service worker caching
- Installation prompts
- Mobile-responsive design

### 6. **Accessibility**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- High contrast support

## Environment Configuration

### Required Environment Variables (Optional)
Create `.env.local` for custom configuration:
\`\`\`bash
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with Web Audio API support

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
\`\`\`bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
\`\`\`

#### 2. Module Not Found Errors
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

#### 3. Audio Not Working
- Check browser permissions for audio access
- Verify headphones are connected
- Ensure Web Audio API is enabled in browser

#### 4. PDF Generation Issues
- PDF supports ASCII characters only (emoji not supported)
- Ensure sufficient browser memory for large reports
- Check browser console for specific errors

## Performance Tips

1. **Use over-ear headphones** for accurate testing
2. **Test in quiet environment** (background noise < 40dB)
3. **Use calibrated devices** for consistent results
4. **Cache calibration profiles** for repeated use
5. **Clear old reports** periodically from IndexedDB

## Deployment

### Vercel Deployment (Recommended)
\`\`\`bash
# Connect GitHub repository and deploy automatically
# or use Vercel CLI:
npm i -g vercel
vercel
\`\`\`

### Self-Hosted (Node.js Server)
\`\`\`bash
# Build
npm run build

# Run on specific port
PORT=5000 npm start
\`\`\`

### Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Medical Disclaimer

**IMPORTANT**: HearRight is a screening tool and NOT a substitute for professional audiological evaluation. Results depend on:
- Device calibration
- Headphone quality
- Testing environment noise levels
- User compliance

Always consult qualified audiologists for diagnosis and treatment.

## Support & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [PDF-lib](https://pdf-lib.js.org)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---
Last Updated: November 2025
