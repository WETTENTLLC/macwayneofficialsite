#!/bin/bash
# Mac Wayne Battered Coin - Quick Deployment Verification Script
# Run this script after uploading to verify everything is working

echo "🚀 Mac Wayne Battered Coin - Deployment Verification"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get domain from user
read -p "Enter your domain (e.g., macwayneofficial.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Domain is required${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Testing domain: $DOMAIN${NC}\n"

# Function to test URL
test_url() {
    local url=$1
    local name=$2
    
    echo -n "Testing $name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "https://$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        return 1
    fi
}

# Function to test SSL
test_ssl() {
    echo -n "Testing SSL certificate... "
    
    if echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | grep -q "Verify return code: 0"; then
        echo -e "${GREEN}✅ VALID${NC}"
        return 0
    else
        echo -e "${RED}❌ INVALID${NC}"
        return 1
    fi
}

# Run tests
echo "🔍 Running Basic Connectivity Tests:"
test_url "$DOMAIN" "Main Site"
test_url "$DOMAIN/battered-coin.html" "Battered Coin Page"
test_url "$DOMAIN/verify-deployment.html" "Verification Page"

echo -e "\n🔒 Testing SSL/HTTPS:"
test_ssl

echo -e "\n📱 Testing Response Headers:"
echo -n "Checking HSTS header... "
if curl -s -I "https://$DOMAIN" | grep -i "strict-transport-security" > /dev/null; then
    echo -e "${GREEN}✅ PRESENT${NC}"
else
    echo -e "${YELLOW}⚠️  MISSING${NC}"
fi

echo -n "Checking Content-Security-Policy... "
if curl -s -I "https://$DOMAIN" | grep -i "content-security-policy" > /dev/null; then
    echo -e "${GREEN}✅ PRESENT${NC}"
else
    echo -e "${YELLOW}⚠️  MISSING${NC}"
fi

echo -e "\n🎯 JavaScript/API Tests:"
echo -n "Testing JavaScript execution... "
if curl -s "https://$DOMAIN" | grep -q "production-config.js"; then
    echo -e "${GREEN}✅ CONFIG LOADED${NC}"
else
    echo -e "${RED}❌ CONFIG MISSING${NC}"
fi

echo -e "\n📊 Performance Quick Check:"
echo -n "Measuring page load time... "
LOAD_TIME=$(curl -o /dev/null -s -w "%{time_total}" "https://$DOMAIN")
echo -e "${GREEN}${LOAD_TIME}s${NC}"

if (( $(echo "$LOAD_TIME < 3.0" | bc -l) )); then
    echo -e "${GREEN}✅ Load time acceptable (<3s)${NC}"
else
    echo -e "${YELLOW}⚠️  Load time slow (>3s)${NC}"
fi

echo -e "\n🎉 DEPLOYMENT VERIFICATION COMPLETE!"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Visit https://$DOMAIN/verify-deployment.html for detailed testing"
echo "2. Update production-config.js with real API keys"
echo "3. Test wallet connectivity and cryptocurrency features"
echo "4. Run full Lighthouse audit"
echo -e "\n${GREEN}🚀 Ready for launch when all tests pass!${NC}"
