# Push to New GitHub Repository

## Current Status
✅ Git remote updated to: `https://github.com/S-Matheka/patrons-live.git`

---

## Steps to Push

### Option 1: Repository Already Exists

If you've already created `patrons-live` on GitHub:

```bash
# Push all commits
git push -u origin main

# If it asks for credentials, use:
# Username: Your GitHub username
# Password: Personal Access Token (not your password)
```

---

### Option 2: Create Repository First

If the repository doesn't exist yet:

**1. Create Repository on GitHub**
- Go to: https://github.com/new
- Repository name: `patrons-live`
- Description: "Patrons Cup Live Scoring System"
- Visibility: Public or Private (your choice)
- **DO NOT** initialize with README, .gitignore, or license
- Click "Create repository"

**2. Push Your Code**
```bash
git push -u origin main
```

---

### Option 3: Force Push (If Repository Exists with Different Content)

If the repository exists but has different content:

```bash
# Force push (WARNING: This will overwrite remote content)
git push -u origin main --force
```

---

## Troubleshooting

### "Repository not found"
**Cause:** Repository doesn't exist or you don't have access

**Solution:**
1. Create repository on GitHub first
2. Verify repository name is exactly: `patrons-live`
3. Check you're logged into correct GitHub account

### "Authentication failed"
**Cause:** Need Personal Access Token

**Solution:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `Patrons Live Deploy`
4. Select scopes: ✅ `repo` (all)
5. Click "Generate token"
6. Copy token
7. Use token as password when pushing

### "Permission denied"
**Cause:** Don't have write access to repository

**Solution:**
1. Verify you own the repository
2. Or ask repository owner to add you as collaborator

---

## Quick Commands

### Check Current Remote
```bash
git remote -v
```

### Change Remote URL
```bash
git remote set-url origin https://github.com/S-Matheka/patrons-live.git
```

### Push to Repository
```bash
git push -u origin main
```

### View Commit History
```bash
git log --oneline -10
```

---

## After Successful Push

### Connect to Netlify

1. **Go to Netlify Dashboard**
   - https://app.netlify.com

2. **Update Site Settings**
   - Go to your site
   - Site settings → Build & deploy → Continuous deployment
   - Click "Link repository"
   - Select: `S-Matheka/patrons-live`

3. **Or Create New Site**
   - Click "Add new site"
   - Import from Git
   - Select GitHub
   - Choose `S-Matheka/patrons-live`
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables
   - Deploy!

---

## Summary

**Current remote:** `https://github.com/S-Matheka/patrons-live.git`

**To push:**
1. Create repository on GitHub (if not exists)
2. Run: `git push -u origin main`
3. Enter credentials (use Personal Access Token as password)
4. Connect to Netlify

---

## All Your Commits Are Ready

You have all your work committed locally:
- ✅ CMS implementation
- ✅ Multi-tournament support
- ✅ Customizable settings
- ✅ Nancy Millar Trophy data
- ✅ Deployment fixes
- ✅ All documentation

Just need to push to GitHub!
