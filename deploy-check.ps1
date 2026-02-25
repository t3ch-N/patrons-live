# Deployment Checklist for Patrons Cup Live (Windows)
# Run this before deploying to production

Write-Host "🏌️ Patrons Cup Live - Deployment Checklist" -ForegroundColor Cyan
Write-Host "==========================================="
Write-Host ""

$allChecks = $true

# Check Node version
Write-Host "📦 Checking Node.js version..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    if ($nodeVersion -match "v(18|20|22)\.") {
        Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "✗ Node.js version $nodeVersion not supported. Please use v18, v20, or v22" -ForegroundColor Red
        $allChecks = $false
    }
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js" -ForegroundColor Red
    $allChecks = $false
}
Write-Host ""

# Check if .env.local exists
Write-Host "🔐 Checking environment variables..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    Write-Host "✓ .env.local file exists" -ForegroundColor Green
    
    $envContent = Get-Content .env.local -Raw
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL" -and 
        $envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY" -and 
        $envContent -match "SUPABASE_SERVICE_ROLE_KEY") {
        Write-Host "✓ All required environment variables present" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing required environment variables" -ForegroundColor Red
        Write-Host "   Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Red
        $allChecks = $false
    }
} else {
    Write-Host "✗ .env.local file not found" -ForegroundColor Red
    Write-Host "   Copy .env.local.template to .env.local and fill in your Supabase credentials" -ForegroundColor Red
    $allChecks = $false
}
Write-Host ""

# Check dependencies
Write-Host "📚 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Write-Host "✓ node_modules directory exists" -ForegroundColor Green
} else {
    Write-Host "! node_modules not found. Running npm install..." -ForegroundColor Yellow
    npm install
}
Write-Host ""

# Test database connection
Write-Host "🗄️  Testing Supabase connection..." -ForegroundColor Yellow
try {
    $result = node test-connection.js 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Supabase connection successful" -ForegroundColor Green
    } else {
        Write-Host "✗ Supabase connection failed" -ForegroundColor Red
        Write-Host "   Run: npm run db:test for details" -ForegroundColor Red
        $allChecks = $false
    }
} catch {
    Write-Host "✗ Could not test Supabase connection" -ForegroundColor Red
    $allChecks = $false
}
Write-Host ""

# Build test
Write-Host "🔨 Testing production build..." -ForegroundColor Yellow
Write-Host "   (This may take a minute...)" -ForegroundColor Gray
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Production build successful" -ForegroundColor Green
    } else {
        Write-Host "✗ Production build failed" -ForegroundColor Red
        Write-Host "   Run: npm run build for details" -ForegroundColor Red
        $allChecks = $false
    }
} catch {
    Write-Host "✗ Build test failed" -ForegroundColor Red
    $allChecks = $false
}
Write-Host ""

# Check Git status
Write-Host "📝 Checking Git status..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
    
    $remotes = git remote -v 2>&1
    if ($remotes -match "origin") {
        Write-Host "✓ Git remote 'origin' configured" -ForegroundColor Green
    } else {
        Write-Host "! No Git remote configured" -ForegroundColor Yellow
        Write-Host "   Add remote: git remote add origin <your-repo-url>" -ForegroundColor Yellow
    }
} else {
    Write-Host "! Not a Git repository" -ForegroundColor Yellow
    Write-Host "   Initialize: git init" -ForegroundColor Yellow
}
Write-Host ""

# Final status
Write-Host ""
if ($allChecks) {
    Write-Host "🚀 Ready to Deploy!" -ForegroundColor Green
    Write-Host "===================" -ForegroundColor Green
} else {
    Write-Host "⚠️  Please fix the issues above before deploying" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Deployment instructions
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Push to Git:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Ready for deployment'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy to Netlify:" -ForegroundColor White
Write-Host "   - Go to https://app.netlify.com" -ForegroundColor Gray
Write-Host "   - Click 'Add new site' → 'Import an existing project'" -ForegroundColor Gray
Write-Host "   - Connect your repository" -ForegroundColor Gray
Write-Host "   - Add environment variables from .env.local" -ForegroundColor Gray
Write-Host "   - Deploy!" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Configure custom domain:" -ForegroundColor White
Write-Host "   - In Netlify: Domain settings → Add custom domain" -ForegroundColor Gray
Write-Host "   - Enter: patronscup.mygolfhub.africa" -ForegroundColor Gray
Write-Host "   - Add DNS CNAME record:" -ForegroundColor Gray
Write-Host "     Type: CNAME" -ForegroundColor Gray
Write-Host "     Name: patronscup" -ForegroundColor Gray
Write-Host "     Value: <your-site>.netlify.app" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Verify deployment:" -ForegroundColor White
Write-Host "   - Check https://patronscup.mygolfhub.africa" -ForegroundColor Gray
Write-Host "   - Test leaderboard updates" -ForegroundColor Gray
Write-Host "   - Verify admin panel access" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Full guide: See DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host "🏗️  Future plans: See MULTI_TOURNAMENT_HUB_PLAN.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Good luck! 🏌️⛳" -ForegroundColor Green
