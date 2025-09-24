#!/bin/bash

# Check if we're in CI (GitHub Actions) or local development
if [ -f ".env.local" ]; then
    # Local development: source the env file
    source .env.local
    echo "📁 Using local .env.local file"
else
    # CI environment: use environment variables directly
    echo "🚀 Using CI environment variables"
fi

# Ensure required environment variables are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_REGION" ] || [ -z "$WEB_BUCKET" ]; then
    echo "❌ Error: Required AWS environment variables are not set"
    echo "Required: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, WEB_BUCKET"
    exit 1
fi

echo "🔄 Syncing to S3 bucket: $WEB_BUCKET"
aws s3 sync ./out $WEB_BUCKET --exclude "*.DS_Store" --delete

if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed to S3"
else
    echo "❌ Failed to deploy to S3"
    exit 1
fi