# Fix Netlify Deployment Errors

## ✅ Issues Fixed

### 1. Missing `createClient` Export ✅
**Fixed in:** `src/lib/supabase.ts`

### 2. Build-Time Environment Variable Error ✅
**Fixed in:** `src/app/api/scoring/update-hole/route.ts`
- Moved Supabase initialization from module scope to request handler
- Prevents build-time requirement of `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚀 Deploy to Netlify

### Step 1: Push Code
```bash
git add -A
git commit -m "Fix Netlify build - move Supabase init to runtime"
git push origin main
```

### Step 2: Add Environment Variables

**Go to:** Netlify Dashboard → Site settings → Environment variables

**Add these 3 variables:**

```
NEXT_PUBLIC_SUPABASE_URL
https://kcziaodnfwoinssxiipr.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjemlhb2RuZndvaW5zc3hpaXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MTY0MTQsImV4cCI6MjA3MTI5MjQxNH0.bLBx1XS4qiBFl4tWq-lFHIeQiC9TrHCdNDxWOaydHd8

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjemlhb2RuZndvaW5zc3hpaXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcxNjQxNCwiZXhwIjoyMDcxMjkyNDE0fQ.1P1M-mzn01eAUfDtUF3tShkZMv0h0xiQtvJBw8O6THQ
```

### Step 3: Deploy
- Netlify will auto-deploy when you push
- Or manually: Deploys → Trigger deploy

### Step 4: Verify
- Build should succeed ✅
- No environment variable errors ✅
- Site loads correctly ✅

---

## What Was Changed

### Before (Caused Build Error):
```typescript
// Module scope - runs at build time
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}
const supabase = createClient(url, supabaseServiceKey);
```

### After (Fixed):
```typescript
export async function POST(request: NextRequest) {
  // Runtime - only runs when API is called
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  const supabase = createClient(url, supabaseServiceKey);
  // ...
}
```

---

## Why This Fixes The Build

**Problem:** Next.js runs API routes during build to collect page data. If environment variables are required at module scope, the build fails when they're missing.

**Solution:** Initialize Supabase client inside the request handler (runtime) instead of at module scope (build time). This way:
- Build succeeds even without the secret
- Secret is only required when API is actually called
- More secure (secret not in build artifacts)

---

## Troubleshooting

### Build Still Fails
1. Clear build cache: Site settings → Build & deploy → Clear cache
2. Verify all 3 env vars are set
3. Check env var names match exactly (case-sensitive)

### Runtime Errors
If you see "Server misconfigured" at runtime:
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Netlify
- Check the value is correct (no extra spaces)
- Redeploy after adding the variable

---

## Quick Checklist

- [ ] Code changes committed and pushed
- [ ] All 3 environment variables added in Netlify
- [ ] New deploy triggered
- [ ] Build succeeded
- [ ] Site loads without errors
- [ ] API routes work correctly

---

**Your deployment should now succeed!** 🚀

---

## Steps to Fix Deployment

### Step 1: Commit and Push Code Fix
```bash
git add src/lib/supabase.ts
git commit -m "Fix createClient export for Netlify deployment"
git push origin main
```

### Step 2: Add Environment Variables in Netlify

1. **Go to Netlify Dashboard**
   - Open: https://app.netlify.com
   - Select your site

2. **Navigate to Environment Variables**
   - Click "Site settings"
   - Click "Environment variables" (left sidebar)
   - Or go to: Site settings → Build & deploy → Environment

3. **Add Variables** (Click "Add a variable")

   **Variable 1:**
   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://kcziaodnfwoinssxiipr.supabase.co
   Scopes: All (or select specific contexts)
   ```

   **Variable 2:**
   ```
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjemlhb2RuZndvaW5zc3hpaXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MTY0MTQsImV4cCI6MjA3MTI5MjQxNH0.bLBx1XS4qiBFl4tWq-lFHIeQiC9TrHCdNDxWOaydHd8
   Scopes: All
   ```

   **Variable 3:**
   ```
   Key: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjemlhb2RuZndvaW5zc3hpaXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcxNjQxNCwiZXhwIjoyMDcxMjkyNDE0fQ.1P1M-mzn01eAUfDtUF3tShkZMv0h0xiQtvJBw8O6THQ
   Scopes: All
   ```

4. **Save Variables**

### Step 3: Trigger New Deploy

**Option A: Automatic (if connected to Git)**
- Push code changes
- Netlify auto-deploys

**Option B: Manual**
- Go to "Deploys" tab
- Click "Trigger deploy" → "Deploy site"

### Step 4: Monitor Build

1. Watch build logs in Netlify
2. Should see: "Build succeeded"
3. Check deploy preview URL

### Step 5: Verify Deployment

Visit your site and check:
- [ ] Homepage loads
- [ ] `/cms` page works
- [ ] `/cms/main-site` page works
- [ ] No console errors
- [ ] Supabase connection works

---

## Alternative: Use netlify.toml (Not Recommended for Secrets)

If you want to set env vars in code (NOT recommended for production secrets):

```toml
# netlify.toml
[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "https://kcziaodnfwoinssxiipr.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-anon-key"
  # DO NOT commit service role key in code!
```

**Warning:** Never commit `SUPABASE_SERVICE_ROLE_KEY` to Git. Always use Netlify UI for secrets.

---

## Troubleshooting

### Build Still Fails After Adding Env Vars

1. **Clear build cache:**
   - Site settings → Build & deploy → Build settings
   - Click "Clear cache and retry deploy"

2. **Check env var names:**
   - Must match exactly (case-sensitive)
   - No extra spaces
   - No quotes around values

3. **Verify env vars are set:**
   - In build logs, look for: "Environment variables loaded"
   - Should NOT see: "Missing Supabase environment variables"

### Import Errors Persist

1. **Check file exists:**
   ```bash
   ls src/lib/supabase.ts
   ```

2. **Verify export:**
   ```typescript
   // Should have this line:
   export const createClient = () => { ... }
   ```

3. **Check imports in CMS files:**
   ```typescript
   // Should be:
   import { createClient } from '@/lib/supabase';
   ```

### Service Role Key Error at Runtime

**If you see:** "SUPABASE_SERVICE_ROLE_KEY is required"

**Solution:** This key should only be used server-side. Make sure:
- It's set in Netlify environment variables
- It's NOT exposed to client-side code
- It's only used in API routes or server components

---

## Quick Checklist

- [ ] Code fix committed and pushed
- [ ] All 3 environment variables added in Netlify
- [ ] New deploy triggered
- [ ] Build succeeded (check logs)
- [ ] Site loads without errors
- [ ] CMS pages accessible
- [ ] Supabase connection works

---

## Summary

**What was fixed:**
1. ✅ Added `createClient` export to `src/lib/supabase.ts`
2. ✅ Created guide for adding environment variables

**What you need to do:**
1. Push code changes
2. Add 3 environment variables in Netlify
3. Trigger new deploy
4. Verify site works

**Expected result:**
- Build succeeds
- No import errors
- CMS pages work
- Supabase connected

---

## Support

If deployment still fails:
1. Check build logs in Netlify
2. Look for specific error messages
3. Verify all environment variables are set correctly
4. Try clearing cache and redeploying
