# 🚀 DEPLOY NOW - Step by Step

## ✅ Step 1: Push Code to GitHub

### Option A: Using GitHub Desktop (Easiest)
1. Open GitHub Desktop
2. Select repository: `patrons-cup-live`
3. Click "Push origin"
4. Done! ✅

### Option B: Using Command Line
```powershell
# In your project folder, run:
git push origin main

# If it asks for credentials:
# - Username: Your GitHub username
# - Password: Use Personal Access Token (not your password!)
```

### Create Personal Access Token (if needed):
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `Netlify Deploy`
4. Select scopes: ✅ `repo` (all)
5. Click "Generate token"
6. Copy the token (save it somewhere safe!)
7. Use this token as your password when pushing

---

## ✅ Step 2: Deploy to Netlify

### 2.1 Sign Up / Log In
1. Go to: https://app.netlify.com
2. Sign up with GitHub (easiest) or email
3. Authorize Netlify to access your GitHub

### 2.2 Import Project
1. Click **"Add new site"** button
2. Click **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Find and select: `S-Matheka/patrons-cup-live`
5. Click on the repository

### 2.3 Configure Build Settings
Netlify should auto-detect these settings:

```
Build command: npm run build
Publish directory: .next
```

If not, enter them manually.

### 2.4 Add Environment Variables
Click **"Show advanced"** → **"New variable"**

Add these 3 variables:

**Variable 1:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://kcziaodnfwoinssxiipr.supabase.co
```

**Variable 2:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjemlhb2RuZndvaW5zc3hpaXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MTY0MTQsImV4cCI6MjA3MTI5MjQxNH0.bLBx1XS4qiBFl4tWq-lFHIeQiC9TrHCdNDxWOaydHd8
```

**Variable 3:**
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjemlhb2RuZndvaW5zc3hpaXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcxNjQxNCwiZXhwIjoyMDcxMjkyNDE0fQ.1P1M-mzn01eAUfDtUF3tShkZMv0h0xiQtvJBw8O6THQ
```

### 2.5 Deploy!
1. Click **"Deploy site"**
2. Wait 2-3 minutes for build
3. You'll get a URL like: `random-name-123.netlify.app`
4. Click the URL to verify your site works!

---

## ✅ Step 3: Add Custom Domain

### 3.1 In Netlify Dashboard
1. Go to **"Domain settings"** (in left sidebar)
2. Click **"Add custom domain"**
3. Enter: `patronscup.mygolfhub.africa`
4. Click **"Verify"**
5. Click **"Add domain"**

Netlify will show you need to configure DNS.

### 3.2 Note Your Netlify URL
Copy your Netlify URL (e.g., `patronscup-live-abc123.netlify.app`)
You'll need this for DNS configuration.

---

## ✅ Step 4: Configure DNS

### Where is your domain hosted?
Find where `mygolfhub.africa` is registered/managed:
- Cloudflare?
- AWS Route 53?
- GoDaddy?
- Namecheap?
- Other?

### Add CNAME Record

**For Cloudflare:**
1. Log in to Cloudflare
2. Select domain: `mygolfhub.africa`
3. Go to **DNS** → **Records**
4. Click **"Add record"**
5. Fill in:
   - Type: `CNAME`
   - Name: `patronscup`
   - Target: `your-site-name.netlify.app` (from Step 3.2)
   - Proxy status: **DNS only** (gray cloud, not orange)
   - TTL: Auto
6. Click **"Save"**

**For AWS Route 53:**
1. Go to Route 53 Console
2. Select hosted zone: `mygolfhub.africa`
3. Click **"Create record"**
4. Fill in:
   - Record name: `patronscup`
   - Record type: `CNAME`
   - Value: `your-site-name.netlify.app`
   - TTL: 300
5. Click **"Create records"**

**For GoDaddy:**
1. Log in to GoDaddy
2. Go to **My Products** → **DNS**
3. Find `mygolfhub.africa` and click **"DNS"**
4. Click **"Add"** under Records
5. Fill in:
   - Type: `CNAME`
   - Name: `patronscup`
   - Value: `your-site-name.netlify.app`
   - TTL: 1 Hour
6. Click **"Save"**

**For Namecheap:**
1. Log in to Namecheap
2. Go to **Domain List** → Select `mygolfhub.africa`
3. Click **"Advanced DNS"**
4. Click **"Add New Record"**
5. Fill in:
   - Type: `CNAME Record`
   - Host: `patronscup`
   - Value: `your-site-name.netlify.app`
   - TTL: Automatic
6. Click **"Save"**

---

## ✅ Step 5: Wait for DNS Propagation

### How long?
- Usually: 5-30 minutes
- Sometimes: Up to 48 hours

### Check DNS Status
```powershell
# In PowerShell, run:
nslookup patronscup.mygolfhub.africa

# You should see your Netlify URL in the response
```

### Online Checker
Go to: https://dnschecker.org
- Enter: `patronscup.mygolfhub.africa`
- Type: `CNAME`
- Check if it's propagated globally

---

## ✅ Step 6: Enable HTTPS in Netlify

### Automatic SSL Certificate
1. Go back to Netlify Dashboard
2. Go to **"Domain settings"**
3. Scroll to **"HTTPS"**
4. Wait for "Certificate provisioning" to complete (5-10 minutes)
5. Once done, you'll see: **"Your site has HTTPS enabled"**

---

## ✅ Step 7: Verify Deployment

### Test Your Site
Visit: https://patronscup.mygolfhub.africa

**Check these:**
- [ ] Site loads (no errors)
- [ ] HTTPS works (padlock icon in browser)
- [ ] Homepage displays correctly
- [ ] Leaderboard shows tournament data
- [ ] Schedule page works
- [ ] Teams page shows all teams
- [ ] Admin panel is accessible
- [ ] Mobile responsive (test on phone)

---

## 🎉 You're Live!

Your site is now deployed at:
**https://patronscup.mygolfhub.africa**

---

## 🆘 Troubleshooting

### Build Failed in Netlify
1. Check build logs in Netlify
2. Verify environment variables are correct
3. Try deploying again

### DNS Not Working
1. Wait longer (can take up to 48 hours)
2. Verify CNAME record is correct
3. Make sure Cloudflare proxy is OFF (gray cloud)
4. Clear your DNS cache:
   ```powershell
   ipconfig /flushdns
   ```

### Site Loads But No Data
1. Check Supabase credentials in Netlify
2. Verify database has data (run migrate-data.js)
3. Check browser console for errors (F12)

### HTTPS Not Working
1. Wait for Netlify to provision certificate (5-10 minutes)
2. Check domain is verified in Netlify
3. Try "Renew certificate" in Netlify dashboard

---

## 📞 Need More Help?

- **Netlify Docs:** https://docs.netlify.com
- **DNS Guide:** See `DNS_SETUP_GUIDE.md` in your project
- **Full Guide:** See `DEPLOYMENT_GUIDE.md` in your project

---

## ✅ Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Site deployed to Netlify
- [ ] Environment variables added
- [ ] Custom domain added in Netlify
- [ ] CNAME record created in DNS
- [ ] DNS propagated (nslookup works)
- [ ] HTTPS certificate active
- [ ] Site accessible at custom domain
- [ ] All features working

---

**You've got this! 🚀**

Follow these steps one by one, and you'll be live in about an hour!
