#!/bin/bash

# HearRight Application - Linux/macOS Bash Script
# This script handles installation and running the app

echo ""
echo "====================================="
echo "   HearRight - Audio Audiometer App"
echo "   Linux/macOS Setup & Run Script"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please download and install Node.js from: https://nodejs.org/"
    echo "Recommended: LTS version (18+)"
    exit 1
fi

echo "[OK] Node.js found:"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not found!"
    echo "Please ensure Node.js is properly installed."
    exit 1
fi

echo "[OK] npm found:"
npm --version
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    echo "This may take a few minutes on first run..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Dependency installation failed!"
        exit 1
    fi
    echo "[OK] Dependencies installed successfully!"
    echo ""
fi

# Ask user for mode
echo "====================================="
echo "    SELECT RUNNING MODE"
echo "====================================="
echo ""
echo "1. Development Mode (Hot Reload)"
echo "2. Production Build"
echo "3. Production Run"
echo "4. Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "[INFO] Starting Development Server..."
        echo "[INFO] App will be available at: http://localhost:3000"
        echo "[INFO] Press Ctrl+C to stop the server"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "[INFO] Building for Production..."
        echo "This may take a few minutes..."
        echo ""
        npm run build
        if [ $? -ne 0 ]; then
            echo "[ERROR] Build failed!"
            exit 1
        fi
        echo "[OK] Build completed successfully!"
        echo ""
        echo "Next steps:"
        echo "- Run 'npm start' to start production server"
        echo "- Or run this script again and choose option 3"
        echo ""
        ;;
    3)
        echo ""
        echo "[INFO] Starting Production Server..."
        echo "[INFO] App will be available at: http://localhost:3000"
        echo "[INFO] Press Ctrl+C to stop the server"
        echo ""
        if [ ! -d ".next" ]; then
            echo "[WARNING] Build not found. Building now..."
            npm run build
            if [ $? -ne 0 ]; then
                echo "[ERROR] Build failed!"
                exit 1
            fi
        fi
        npm start
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice. Exiting..."
        exit 1
        ;;
esac
