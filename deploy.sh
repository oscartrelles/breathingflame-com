#!/bin/bash

# Breathing Flame - Deployment Script
# This script builds and deploys the website to Firebase hosting

echo "🔥 Breathing Flame - Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️  Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. No dist directory found."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Firebase
echo "🚀 Deploying to Firebase hosting..."
firebase deploy --only hosting

echo "🎉 Deployment complete!"
echo "Your website should be live at: https://breathingflame-com.web.app"
