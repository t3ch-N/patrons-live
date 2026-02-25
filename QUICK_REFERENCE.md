# 📋 Quick Reference Card

## 🔗 Important Links

### Your Repository
```
https://github.com/S-Matheka/patrons-cup-live
```

### Netlify
```
https://app.netlify.com
```

### Your Target Domain
```
https://patronscup.mygolfhub.africa
```

---

## 🔑 Environment Variables (Copy-Paste Ready)

### Variable 1
```
NEXT_PUBLIC_SUPABASE_URL
https://kcziaodnfwoinssxiipr.supabase.co
```

### Variable 2
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjemlhb2RuZndvaW5zc3hpaXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MTY0MTQsImV4cCI6MjA3MTI5MjQxNH0.bLBx1XS4qiBFl4tWq-lFHIeQiC9TrHCdNDxWOaydHd8
```

### Variable 3
```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjemlhb2RuZndvaW5zc3hpaXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcxNjQxNCwiZXhwIjoyMDcxMjkyNDE0fQ.1P1M-mzn01eAUfDtUF3tShkZMv0h0xiQtvJBw8O6THQ
```

---

## 🌐 DNS Configuration

### CNAME Record
```
Type: CNAME
Name: patronscup
Value: [your-netlify-site].netlify.app
TTL: Auto or 3600
```

**Important:** Replace `[your-netlify-site]` with your actual Netlify URL

---

## ⚡ Quick Commands

### Push to GitHub
```powershell
git push origin main
```

### Check DNS
```powershell
nslookup patronscup.mygolfhub.africa
```

### Clear DNS Cache
```powershell
ipconfig /flushdns
```

---

## ✅ Deployment Checklist

1. [ ] Push code to GitHub
2. [ ] Create Netlify account
3. [ ] Import GitHub repository
4. [ ] Add 3 environment variables
5. [ ] Deploy site
6. [ ] Add custom domain in Netlify
7. [ ] Create CNAME record in DNS
8. [ ] Wait for DNS propagation (5-30 min)
9. [ ] Verify HTTPS is enabled
10. [ ] Test site functionality

---

## 🆘 Quick Troubleshooting

### Build Failed
- Check environment variables
- Check build logs
- Verify Node.js version

### DNS Not Working
- Wait longer (up to 48 hours)
- Verify CNAME record
- Clear DNS cache

### No Data Showing
- Check Supabase credentials
- Verify database has data
- Check browser console (F12)

---

## 📞 Support Links

- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- GitHub Token: https://github.com/settings/tokens
- DNS Checker: https://dnschecker.org

---

## 📖 Full Guides

- `DEPLOY_NOW.md` - Complete step-by-step
- `DNS_SETUP_GUIDE.md` - Detailed DNS help
- `DEPLOYMENT_GUIDE.md` - Full deployment guide

---

**Keep this file open while deploying!**
