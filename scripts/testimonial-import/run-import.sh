#!/bin/bash

# Testimonial Import & Management System Runner
# Usage: ./scripts/testimonial-import/run-import.sh <command> [options]

set -e

echo "🏷️ Testimonial Import & Management System"
echo ""

# Check if tsx is available
if ! command -v tsx &> /dev/null; then
    echo "❌ tsx not found. Installing..."
    npm install -g tsx
fi

# Run the import script
tsx scripts/testimonial-import/run-import.ts "$@"

