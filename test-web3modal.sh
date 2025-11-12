#!/bin/bash

# Quick test script for Web3Modal integration

echo "🧪 Web3Modal Integration Test Script"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the autoconnect root directory"
    exit 1
fi

echo "📦 Step 1: Building the package..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

echo "📂 Step 2: Setting up Web3Modal example..."
cd src/examples/web3modal

if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo ""
    echo "⚙️  Please edit src/examples/web3modal/.env with your credentials:"
    echo "   - VITE_WALLETCONNECT_PROJECT_ID (get from https://cloud.walletconnect.com)"
    echo "   - VITE_THIRDWEB_CLIENT_ID (get from https://thirdweb.com/dashboard)"
    echo ""
    echo "Then run this script again."
    exit 0
fi

echo "📥 Step 3: Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ Installation failed!"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

echo "🚀 Step 4: Starting development server..."
echo ""
echo "✨ Your test environment is ready!"
echo ""
echo "The example will open at: http://localhost:5173"
echo ""
echo "Things to test:"
echo "  ✅ Connect with MetaMask"
echo "  ✅ Connect with WalletConnect"
echo "  ✅ Send a transaction"
echo "  ✅ Sign a message"
echo "  ✅ Switch networks"
echo "  ✅ Check for Unicorn in wallet list"
echo ""
echo "For Unicorn auto-connect testing, visit:"
echo "  http://localhost:5173/?walletId=inApp&authCookie=test123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
