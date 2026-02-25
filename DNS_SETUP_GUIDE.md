# DNS Configuration Guide

## Setting up `patronscup.mygolfhub.africa`

### Overview
You need to create a CNAME record that points your subdomain to your Netlify/Vercel deployment.

---

## Option 1: Netlify Deployment

### Step 1: Deploy to Netlify
1. Push your code to GitHub/GitLab
2. Connect repository to Netlify
3. Deploy (you'll get a URL like `patronscup-live.netlify.app`)

### Step 2: Add Custom Domain in Netlify
1. Go to your site in Netlify Dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Enter: `patronscup.mygolfhub.africa`
5. Netlify will show you the DNS records needed

### Step 3: Configure DNS
Go to your DNS provider (where `mygolfhub.africa` is hosted) and add:

```
Type: CNAME
Name: patronscup
Value: patronscup-live.netlify.app (or your Netlify URL)
TTL: Auto (or 3600)
```

### Step 4: Wait for DNS Propagation
- Usually takes 5-30 minutes
- Can take up to 48 hours in rare cases
- Check status: `nslookup patronscup.mygolfhub.africa`

### Step 5: Enable HTTPS
- Netlify automatically provisions SSL certificate
- Wait for "HTTPS" badge to show "Secured"
- Usually takes 1-5 minutes after DNS propagates

---

## Option 2: Vercel Deployment

### Step 1: Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

### Step 2: Add Custom Domain
1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add domain: `patronscup.mygolfhub.africa`
4. Vercel will show you the DNS records needed

### Step 3: Configure DNS
```
Type: CNAME
Name: patronscup
Value: cname.vercel-dns.com
TTL: Auto (or 3600)
```

---

## Common DNS Providers

### Cloudflare
1. Log in to Cloudflare Dashboard
2. Select your domain: `mygolfhub.africa`
3. Go to "DNS" → "Records"
4. Click "Add record"
5. Fill in:
   - Type: `CNAME`
   - Name: `patronscup`
   - Target: `patronscup-live.netlify.app` (or Vercel URL)
   - Proxy status: DNS only (gray cloud)
   - TTL: Auto
6. Click "Save"

### AWS Route 53
1. Go to Route 53 Console
2. Select hosted zone: `mygolfhub.africa`
3. Click "Create record"
4. Fill in:
   - Record name: `patronscup`
   - Record type: `CNAME`
   - Value: `patronscup-live.netlify.app`
   - TTL: 300
5. Click "Create records"

### GoDaddy
1. Log in to GoDaddy
2. Go to "My Products" → "DNS"
3. Find `mygolfhub.africa` and click "DNS"
4. Click "Add" under Records
5. Fill in:
   - Type: `CNAME`
   - Name: `patronscup`
   - Value: `patronscup-live.netlify.app`
   - TTL: 1 Hour
6. Click "Save"

### Namecheap
1. Log in to Namecheap
2. Go to "Domain List" → Select `mygolfhub.africa`
3. Click "Advanced DNS"
4. Click "Add New Record"
5. Fill in:
   - Type: `CNAME Record`
   - Host: `patronscup`
   - Value: `patronscup-live.netlify.app`
   - TTL: Automatic
6. Click "Save"

---

## Verification

### Check DNS Propagation
```bash
# Windows (PowerShell)
nslookup patronscup.mygolfhub.africa

# Expected output:
# Name:    patronscup-live.netlify.app
# Addresses: [IP addresses]
# Aliases: patronscup.mygolfhub.africa
```

### Online Tools
- https://dnschecker.org
- https://www.whatsmydns.net
- Enter: `patronscup.mygolfhub.africa`
- Type: `CNAME`

### Test in Browser
1. Wait for DNS to propagate
2. Visit: `https://patronscup.mygolfhub.africa`
3. Should show your tournament site
4. Check for HTTPS (padlock icon)

---

## Troubleshooting

### DNS Not Resolving
**Problem:** `nslookup` returns "can't find"

**Solutions:**
1. Wait longer (DNS propagation can take time)
2. Verify CNAME record is correct
3. Check TTL hasn't expired
4. Clear DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache
   ```

### SSL Certificate Not Working
**Problem:** Browser shows "Not Secure" warning

**Solutions:**
1. Wait for Netlify/Vercel to provision certificate (5-10 minutes)
2. Check domain is verified in dashboard
3. Try "Renew certificate" in dashboard
4. Ensure CNAME is pointing correctly

### Site Shows 404
**Problem:** Domain resolves but shows 404 error

**Solutions:**
1. Check deployment is successful
2. Verify custom domain is added in Netlify/Vercel
3. Check build logs for errors
4. Ensure environment variables are set

### Cloudflare Proxy Issues
**Problem:** Using Cloudflare and site not loading

**Solutions:**
1. Turn off Cloudflare proxy (gray cloud, not orange)
2. Or configure Cloudflare SSL to "Full"
3. Wait for DNS to propagate again

---

## DNS Record Examples

### Correct CNAME Record
```
Type: CNAME
Name: patronscup
Value: patronscup-live.netlify.app
TTL: 3600
```

### Common Mistakes to Avoid
❌ Don't use full domain in Name field:
```
Name: patronscup.mygolfhub.africa  ← WRONG
```

✅ Use only subdomain:
```
Name: patronscup  ← CORRECT
```

❌ Don't add trailing dot in Value:
```
Value: patronscup-live.netlify.app.  ← WRONG
```

✅ No trailing dot:
```
Value: patronscup-live.netlify.app  ← CORRECT
```

---

## Future: Main Hub Setup

When you're ready to set up `mygolfhub.africa` (main hub):

### DNS Configuration
```
Type: A (or CNAME)
Name: @ (or leave blank for root domain)
Value: [Netlify/Vercel IP or CNAME]
TTL: 3600
```

### Subdomain Structure
```
mygolfhub.africa → Main hub
patronscup.mygolfhub.africa → Patrons Cup (current)
karen.mygolfhub.africa → Karen Stableford (future)
nancy.mygolfhub.africa → Nancy Millar (future)
```

Or use path-based routing:
```
mygolfhub.africa → Main hub
mygolfhub.africa/tournaments/patrons-cup-2026
mygolfhub.africa/tournaments/karen-stableford-2026
mygolfhub.africa/tournaments/nancy-millar-2026
```

---

## Quick Reference

### Netlify DNS
```
CNAME: patronscup → [your-site].netlify.app
```

### Vercel DNS
```
CNAME: patronscup → cname.vercel-dns.com
```

### Check Propagation
```bash
nslookup patronscup.mygolfhub.africa
```

### Test HTTPS
```bash
curl -I https://patronscup.mygolfhub.africa
```

---

## Support

### Netlify Support
- Docs: https://docs.netlify.com/domains-https/custom-domains/
- Support: https://answers.netlify.com

### Vercel Support
- Docs: https://vercel.com/docs/concepts/projects/domains
- Support: https://vercel.com/support

### DNS Provider Support
- Cloudflare: https://support.cloudflare.com
- Route 53: https://aws.amazon.com/route53/
- GoDaddy: https://www.godaddy.com/help
- Namecheap: https://www.namecheap.com/support/

---

## Checklist

Before going live:
- [ ] Code pushed to Git repository
- [ ] Deployed to Netlify/Vercel
- [ ] Environment variables configured
- [ ] Custom domain added in dashboard
- [ ] CNAME record created in DNS
- [ ] DNS propagation complete (nslookup works)
- [ ] HTTPS certificate active
- [ ] Site loads at custom domain
- [ ] All features working (leaderboard, admin, etc.)
- [ ] Mobile responsive tested
- [ ] Performance optimized (Lighthouse score)

---

## Timeline

**Immediate (5 minutes):**
- Create CNAME record

**Short-term (30 minutes):**
- DNS propagation starts
- Can test with nslookup

**Medium-term (1-2 hours):**
- DNS fully propagated globally
- HTTPS certificate provisioned
- Site fully accessible

**Long-term (24-48 hours):**
- DNS cached worldwide
- All users can access site
- No more propagation delays
