#!/bin/bash

# Package Lambda function for deployment
echo "Packaging Lambda function..."

# Clean up previous package
rm -f function.zip

# Install dependencies
npm install

# Create deployment package
zip -r function.zip . -x "*.zip" "node_modules/*" "package-lock.json" "package.sh" "SETUP.md" "test-event.json"

echo "✅ Function packaged as function.zip"
echo "📦 Upload this file to your Lambda function"
echo "🔧 Make sure to set environment variables:"
echo "   - FROM_EMAIL: your-sender@domain.com"
echo "   - TO_EMAIL: hello@grounded360.com.au"
