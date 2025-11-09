# Exact Commands to Run HearRight

## Windows (CMD) Commands

### 1. Initial Setup (One-time)
\`\`\`cmd
# Navigate to project
cd C:\path\to\HearRight

# Install dependencies
npm install

# Verify installation
npm --version
node --version
\`\`\`

### 2. Start Development Server
\`\`\`cmd
npm run dev
\`\`\`
**Output:** 
\`\`\`
✓ Ready in 3.2s
✓ Compiled client and server successfully
● Local: http://localhost:3000
● Network: use --hostname to expose
\`\`\`

### 3. Build for Production
\`\`\`cmd
npm run build
\`\`\`

### 4. Run Production Build
\`\`\`cmd
npm start
\`\`\`

### 5. Stop Server
\`\`\`cmd
Ctrl + C
\`\`\`

### 6. Check for Errors
\`\`\`cmd
npm run lint
\`\`\`

### 7. Create Production Build (Full Process)
\`\`\`cmd
REM Clean previous build
if exist ".next" rmdir /s /q .next
if exist "node_modules" rmdir /s /q node_modules

REM Reinstall and build
npm install
npm run build
npm start
\`\`\`

---

## Linux/Mac (Terminal) Commands

### 1. Initial Setup
\`\`\`bash
# Navigate to project
cd ~/path/to/HearRight

# Install dependencies
npm install

# Verify installation
npm --version && node --version
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 3. Build Production
\`\`\`bash
npm run build
\`\`\`

### 4. Run Production
\`\`\`bash
npm start
\`\`\`

### 5. Stop Server
\`\`\`bash
Ctrl + C
\`\`\`

### 6. Full Clean Rebuild
\`\`\`bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
npm start
\`\`\`

---

## PowerShell (Advanced Windows)

```powershell
# Navigate to project
Set-Location "C:\path\to\HearRight"

# Install dependencies
npm install

# Development
npm run dev

# Production
npm run build
npm start
