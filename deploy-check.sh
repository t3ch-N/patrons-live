#!/bin/bash

# Deployment Checklist for Patrons Cup Live
# Run this before deploying to production

echo "🏌️ Patrons Cup Live - Deployment Checklist"
echo "==========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
if [[ $NODE_VERSION == v18* ]] || [[ $NODE_VERSION == v20* ]] || [[ $NODE_VERSION == v22* ]]; then
    echo -e "${GREEN}✓${NC} Node.js version: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js version $NODE_VERSION not supported. Please use v18, v20, or v22"
    exit 1
fi
echo ""

# Check if .env.local exists
echo "🔐 Checking environment variables..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✓${NC} .env.local file exists"
    
    # Check for required variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && \
       grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local && \
       grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} All required environment variables present"
    else
        echo -e "${RED}✗${NC} Missing required environment variables"
        echo "   Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY"
        exit 1
    fi
else
    echo -e "${RED}✗${NC} .env.local file not found"
    echo "   Copy .env.local.template to .env.local and fill in your Supabase credentials"
    exit 1
fi
echo ""

# Check dependencies
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${YELLOW}!${NC} node_modules not found. Running npm install..."
    npm install
fi
echo ""

# Test database connection
echo "🗄️  Testing Supabase connection..."
if node test-connection.js > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Supabase connection successful"
else
    echo -e "${RED}✗${NC} Supabase connection failed"
    echo "   Run: npm run db:test for details"
    exit 1
fi
echo ""

# Build test
echo "🔨 Testing production build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Production build successful"
else
    echo -e "${RED}✗${NC} Production build failed"
    echo "   Run: npm run build for details"
    exit 1
fi
echo ""

# Check Git status
echo "📝 Checking Git status..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
    
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✓${NC} Git remote 'origin' configured"
    else
        echo -e "${YELLOW}!${NC} No Git remote configured"
        echo "   Add remote: git remote add origin <your-repo-url>"
    fi
else
    echo -e "${YELLOW}!${NC} Not a Git repository"
    echo "   Initialize: git init"
fi
echo ""

# Deployment instructions
echo "🚀 Ready to Deploy!"
echo "==================="
echo ""
echo "Next steps:"
echo ""
echo "1. Push to Git:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Netlify:"
echo "   - Go to https://app.netlify.com"
echo "   - Click 'Add new site' → 'Import an existing project'"
echo "   - Connect your repository"
echo "   - Add environment variables from .env.local"
echo "   - Deploy!"
echo ""
echo "3. Configure custom domain:"
echo "   - In Netlify: Domain settings → Add custom domain"
echo "   - Enter: patronscup.mygolfhub.africa"
echo "   - Add DNS CNAME record:"
echo "     Type: CNAME"
echo "     Name: patronscup"
echo "     Value: <your-site>.netlify.app"
echo ""
echo "4. Verify deployment:"
echo "   - Check https://patronscup.mygolfhub.africa"
echo "   - Test leaderboard updates"
echo "   - Verify admin panel access"
echo ""
echo "📖 Full guide: See DEPLOYMENT_GUIDE.md"
echo "🏗️  Future plans: See MULTI_TOURNAMENT_HUB_PLAN.md"
echo ""
echo -e "${GREEN}Good luck! 🏌️⛳${NC}"
