# Fix Netlify Deployment Errors

## Issues Fixed

### 1. ✅ Missing `createClient` Export
**Problem:** CMS pages import `createClient` but it wasn't exported from `@/lib/supabase`

**Solution:** Added proper export in `src/lib/supabase.ts`:
```typescript
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    realtime: { params: { eventsPerSecond: 10 } }
  });
};
```

### 2. ⚠️ Missing Environment Variable
**Problem:** Build fails because `SUPABASE_SERVICE_ROLE_KEY` is not set in Netlify

**Solution:** Add environment variable in Netlify Dashboard

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
