#!/bin/bash

# Content validation and migration runner
# Usage: ./scripts/run-validate.sh [--apply]

set -e

echo "🚀 Starting content validation and migration..."

# Check if tsx is available
if ! command -v tsx &> /dev/null; then
    echo "❌ tsx not found. Installing..."
    npm install -g tsx
fi

# Run the validation script
if [ "$1" = "--apply" ]; then
    echo "🔧 Running with --apply flag (will modify en.json)"
    tsx scripts/validateAndMigrateContent.ts --apply
else
    echo "🔍 Running in dry-run mode (will not modify en.json)"
    tsx scripts/validateAndMigrateContent.ts
fi

echo "✅ Validation complete!"
echo ""
echo "📁 Output files:"
echo "  - src/content/en.migrated.json (cleaned content)"
echo "  - src/content/en.report.json (validation report)"
echo ""
echo "💡 To apply changes: ./scripts/run-validate.sh --apply"
