# HearRight - Command Line Reference Guide

## Quick Start Commands

### Windows (CMD)

#### 1. Install Dependencies
\`\`\`cmd
npm install
\`\`\`
or
\`\`\`cmd
npm ci
\`\`\`

#### 2. Run Development Server
\`\`\`cmd
npm run dev
\`\`\`
Opens: http://localhost:3000

#### 3. Build for Production
\`\`\`cmd
npm run build
\`\`\`

#### 4. Run Production Server
\`\`\`cmd
npm start
\`\`\`

#### 5. Run via Batch Script (Recommended)
\`\`\`cmd
run_app.bat
\`\`\`
Interactive menu to select mode

---

### macOS / Linux (Bash/Terminal)

#### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`
or
\`\`\`bash
npm ci
\`\`\`

#### 2. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Opens: http://localhost:3000

#### 3. Build for Production
\`\`\`bash
npm run build
\`\`\`

#### 4. Run Production Server
\`\`\`bash
npm start
\`\`\`

#### 5. Run via Bash Script (Recommended)
\`\`\`bash
chmod +x run_app.sh
./run_app.sh
\`\`\`
Interactive menu to select mode

---

## Detailed Command Reference

### Installation Commands

\`\`\`bash
# Install all dependencies from package.json
npm install

# Install with exact versions (no updates)
npm ci

# Install specific package
npm install package-name

# Install dev dependencies only
npm install --save-dev

# Update npm itself
npm install -g npm@latest

# Check for outdated packages
npm outdated

# Update all packages
npm update
\`\`\`

### Development Commands

\`\`\`bash
# Start development server with hot reload
npm run dev

# Build the project
npm run build

# Start production server
npm start

# Check Next.js build info
npx next info

# Lint code (if configured)
npm run lint

# Format code (if configured)
npm run format
\`\`\`

### Build & Optimization

\`\`\`bash
# Build with detailed output
npm run build -- --verbose

# Build specific page
npm run build -- --filter=app/test

# Analyze bundle size
npm run build -- --profile

# Clean build
rm -rf .next
npm run build

# Export as static (if configured)
npm run export
\`\`\`

### Port & Process Management

#### Windows
\`\`\`cmd
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F

# Run on custom port
set PORT=5000 && npm start
\`\`\`

#### macOS/Linux
\`\`\`bash
# Find process on port 3000
lsof -ti:3000

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Run on custom port
PORT=5000 npm start
\`\`\`

### Docker Commands (If Using Docker)

\`\`\`bash
# Build Docker image
docker build -t hearright:latest .

# Run container
docker run -p 3000:3000 hearright:latest

# Run with environment variable
docker run -p 3000:3000 -e PORT=3000 hearright:latest

# View running containers
docker ps

# Stop container
docker stop <CONTAINER_ID>

# Remove image
docker rmi hearright:latest
\`\`\`

### Database & Storage

\`\`\`bash
# Clear IndexedDB (via browser console)
# indexedDB.deleteDatabase('hearright-db')

# Export all data (via browser console)
# db.export()

# Import data (via browser console)
# db.import(data)
\`\`\`

### Debugging Commands

\`\`\`bash
# Run with debug output
DEBUG=* npm run dev

# Check TypeScript compilation
npx tsc --noEmit

# Check ESLint issues
npm run lint -- --format=json > lint-report.json

# Run specific test
npm test -- --testNamePattern="pattern"
\`\`\`

### Cache & Clean Commands

\`\`\`bash
# Clear npm cache
npm cache clean --force

# Clear build artifacts
rm -rf .next
rm -rf .turbo
rm -rf dist

# Clear node_modules (Windows)
rmdir /s /q node_modules

# Clear node_modules (macOS/Linux)
rm -rf node_modules

# Clean slate reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Deployment Commands

\`\`\`bash
# Prepare for deployment
npm run build

# Test production build locally
npm start

# Deploy to Vercel (if installed)
vercel

# Deploy to other platforms
# Refer to platform-specific documentation
\`\`\`

### Utility Commands

\`\`\`bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List globally installed packages
npm list -g --depth=0

# Check npm configuration
npm config list

# Open npm documentation
npm docs <package-name>

# Check security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix

# Generate package-lock.json
npm ci --package-lock-only
\`\`\`

---

## Troubleshooting Commands

### When Port 3000 is Already in Use

**Windows:**
\`\`\`cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
npm run dev -- -p 3001
\`\`\`

**macOS/Linux:**
\`\`\`bash
lsof -ti:3000 | xargs kill -9
npm run dev -- -p 3001
\`\`\`

### When Dependencies Have Issues

\`\`\`bash
# Remove all dependencies
rm -rf node_modules package-lock.json

# Reinstall fresh
npm install

# Or use npm ci (more reliable)
npm ci
\`\`\`

### When Build Fails

\`\`\`bash
# Clear Next.js cache
rm -rf .next
rm -rf .turbo

# Clean everything
rm -rf node_modules .next package-lock.json

# Fresh install
npm install

# Try build again
npm run build
\`\`\`

### When TypeScript Errors Occur

\`\`\`bash
# Check TypeScript compilation
npx tsc --noEmit

# Generate tsconfig.json
npx tsc --init

# Check specific file
npx tsc app/page.tsx --noEmit
\`\`\`

### Memory Issues During Build

**Windows:**
\`\`\`cmd
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
\`\`\`

**macOS/Linux:**
\`\`\`bash
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
\`\`\`

---

## Environment Variables

### .env.local Example
\`\`\`bash
# Development URL for email redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Custom API endpoints (if needed)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your_id_here
\`\`\`

### Set Environment at Runtime

**Windows:**
\`\`\`cmd
set VARIABLE_NAME=value && npm run dev
\`\`\`

**macOS/Linux:**
\`\`\`bash
VARIABLE_NAME=value npm run dev
\`\`\`

---

## Quick Reference Cheat Sheet

| Task | Command |
|------|---------|
| **Fresh Start** | `rm -rf node_modules && npm install` |
| **Dev Server** | `npm run dev` |
| **Production Build** | `npm run build && npm start` |
| **Check Health** | `node --version && npm --version` |
| **Build Only** | `npm run build` |
| **Kill Port 3000 (Mac/Linux)** | `lsof -ti:3000 \| xargs kill -9` |
| **Kill Port 3000 (Windows)** | `netstat -ano \| findstr :3000` then `taskkill /PID <PID> /F` |
| **Custom Port** | `PORT=5000 npm start` |
| **Check Deps** | `npm outdated` |
| **Fix Vulnerabilities** | `npm audit fix` |
| **Clear Cache** | `npm cache clean --force` |
| **Interactive Menu** | Windows: `run_app.bat` | Mac/Linux: `./run_app.sh` |

---

## Next Steps After Installation

1. **First Run:**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`
   Open browser: http://localhost:3000

2. **Development Workflow:**
   - Keep dev server running
   - Edit files, auto-reload happens
   - Check console for errors

3. **Before Deployment:**
   \`\`\`bash
   npm run build
   npm start
   # Test locally before deploying
   \`\`\`

4. **Production Deployment:**
   - Build: `npm run build`
   - Deploy `.next` folder to hosting
   - Or use `npm start` on your server

---

**Last Updated:** November 2025
**HearRight v1.0**
