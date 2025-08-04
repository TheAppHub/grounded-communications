#!/bin/bash

# Manual deployment script for AWS S3 and CloudFront
# Usage: ./deploy.sh [bucket-name] [distribution-id]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Check if bucket name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide S3 bucket name${NC}"
    echo "Usage: ./deploy.sh <bucket-name> [distribution-id]"
    exit 1
fi

BUCKET_NAME=$1
DISTRIBUTION_ID=$2

echo -e "${YELLOW}🚀 Starting deployment...${NC}"

# Build the project
echo -e "${YELLOW}📦 Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed${NC}"

# Deploy to S3 with proper MIME types
echo -e "${YELLOW}📤 Deploying to S3...${NC}"

# First, sync all files except clean URL files
aws s3 sync dist/ s3://$BUCKET_NAME --delete --exclude "services" --exclude "about" --exclude "contact"

# Then upload clean URL files with proper MIME type
if [ -f "dist/services" ]; then
    aws s3 cp dist/services s3://$BUCKET_NAME/services --content-type "text/html" --cache-control "public, max-age=31536000"
fi

if [ -f "dist/about" ]; then
    aws s3 cp dist/about s3://$BUCKET_NAME/about --content-type "text/html" --cache-control "public, max-age=31536000"
fi

if [ -f "dist/contact" ]; then
    aws s3 cp dist/contact s3://$BUCKET_NAME/contact --content-type "text/html" --cache-control "public, max-age=31536000"
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ S3 deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ S3 deployment completed${NC}"

# Invalidate CloudFront cache if distribution ID is provided
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ CloudFront invalidation failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ CloudFront cache invalidated${NC}"
    echo -e "${YELLOW}⏳ Cache invalidation may take 5-10 minutes to propagate${NC}"
else
    echo -e "${YELLOW}⚠️  No CloudFront distribution ID provided, skipping cache invalidation${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}" 