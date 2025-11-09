@echo off
REM HearRight Application - Windows Batch Script
REM This script handles installation and running the app

echo.
echo =====================================
echo    HearRight - Audio Audiometer App
echo    Windows Setup & Run Script
echo =====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo Recommended: LTS version (18+)
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not found!
    echo Please ensure Node.js is properly installed.
    pause
    exit /b 1
)

echo [OK] npm found:
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo This may take a few minutes on first run...
    echo.
    call npm install
    if errorlevel 1 (
        echo [ERROR] Dependency installation failed!
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully!
    echo.
)

REM Ask user for mode
echo =====================================
echo    SELECT RUNNING MODE
echo =====================================
echo.
echo 1. Development Mode (Hot Reload)
echo 2. Production Build
echo 3. Production Run
echo 4. Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo [INFO] Starting Development Server...
    echo [INFO] App will be available at: http://localhost:3000
    echo [INFO] Press Ctrl+C to stop the server
    echo.
    call npm run dev
) else if "%choice%"=="2" (
    echo.
    echo [INFO] Building for Production...
    echo This may take a few minutes...
    echo.
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
    echo [OK] Build completed successfully!
    echo.
    echo Next steps:
    echo - Run "npm start" to start production server
    echo - Or run this script again and choose option 3
    echo.
    pause
) else if "%choice%"=="3" (
    echo.
    echo [INFO] Starting Production Server...
    echo [INFO] App will be available at: http://localhost:3000
    echo [INFO] Press Ctrl+C to stop the server
    echo.
    if not exist ".next" (
        echo [WARNING] Build not found. Building now...
        call npm run build
        if errorlevel 1 (
            echo [ERROR] Build failed!
            pause
            exit /b 1
        )
    )
    call npm start
) else if "%choice%"=="4" (
    echo Exiting...
    exit /b 0
) else (
    echo Invalid choice. Exiting...
    exit /b 1
)
