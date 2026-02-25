# Deployment Guide - Patrons Cup Live

## Current Setup: Standalone Deployment

### Option 1: Deploy to `patronscup.mygolfhub.africa`

#### Netlify Deployment Steps:

1. **Push to GitHub/GitLab**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Patrons Cup 2026"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your repository
   - Build settings (auto-detected):
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Environment Variables** (Add in Netlify Dashboard)
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
   ```

4. **Custom Domain Setup**
   - In Netlify: Domain settings → Add custom domain
   - Enter: `patronscup.mygolfhub.africa`
   - Add DNS records at your domain provider:
     ```
     Type: CNAME
     Name: patronscup
     Value: <your-netlify-site>.netlify.app
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Site will be live at `patronscup.mygolfhub.africa`

---

## Future Setup: Multi-Tournament Platform

### Architecture Overview

```
mygolfhub.africa (Main Hub - New Next.js App)
├── / (Tournament listing homepage)
├── /tournaments/patrons-cup-2026 (This app)
├── /tournaments/karen-stableford-2026
├── /tournaments/nancy-millar-2026
└── /admin (CMS Dashboard)
```

### Database Schema (Already Multi-Tournament Ready!)

Your current Supabase schema supports multiple tournaments:
- ✅ `tournaments` table with slug-based routing
- ✅ All tables have `tournament_id` foreign keys
- ✅ Ready for multi-tenant architecture

### Migration Path

**Phase 1: Deploy Standalone (NOW)**
- Deploy current app to `patronscup.mygolfhub.africa`
- Fully functional, independent site
- No changes needed to current code

**Phase 2: Create Main Hub (LATER)**
- Create new Next.js app for `mygolfhub.africa`
- Tournament listing page
- Admin CMS dashboard
- Shared Supabase database

**Phase 3: Integration (FUTURE)**
- Move Patrons Cup to `/tournaments/patrons-cup-2026` route
- Add other tournaments as separate route groups
- Centralized authentication and management

---

## Quick Deploy Commands

### Deploy Current App (Standalone)
```bash
# 1. Ensure environment variables are set
cp .env.local.template .env.local
# Edit .env.local with your Supabase credentials

# 2. Test locally
npm run dev

# 3. Build and test production
npm run build
npm start

# 4. Deploy to Netlify (via Git)
git push origin main
```

### Vercel Alternative
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add custom domain in Vercel dashboard
```

---

## DNS Configuration

### For `patronscup.mygolfhub.africa`

**At your DNS provider (e.g., Cloudflare, Route53):**

```
Type: CNAME
Name: patronscup
Value: <netlify-site-name>.netlify.app
TTL: Auto
Proxy: Optional (if using Cloudflare)
```

**Verification:**
```bash
nslookup patronscup.mygolfhub.africa
```

---

## Post-Deployment Checklist

- [ ] Site loads at custom domain
- [ ] SSL certificate is active (HTTPS)
- [ ] Supabase connection works
- [ ] Tournament data displays correctly
- [ ] Admin panel accessible
- [ ] Real-time updates working
- [ ] Mobile responsive
- [ ] Performance optimized (Lighthouse score)

---

## Monitoring & Maintenance

### Netlify Dashboard
- Build logs
- Deploy previews
- Analytics
- Function logs

### Supabase Dashboard
- Database queries
- API usage
- Real-time connections
- Storage usage

---

## Support & Troubleshooting

### Common Issues

**Build Fails:**
- Check environment variables are set
- Verify Node version (18+)
- Clear cache: `rm -rf .next node_modules && npm install`

**Database Connection:**
- Verify Supabase URL and keys
- Check RLS policies
- Test with: `npm run db:test`

**Domain Not Working:**
- Wait for DNS propagation (up to 48 hours)
- Verify CNAME record
- Check SSL certificate status

---

## Next Steps

1. ✅ Deploy standalone to `patronscup.mygolfhub.africa`
2. 📋 Plan main hub architecture
3. 🎨 Design tournament listing page
4. 🔧 Build CMS dashboard
5. 🔗 Integrate multiple tournaments
