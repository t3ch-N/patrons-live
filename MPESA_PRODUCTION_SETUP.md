# M-Pesa Production Setup Guide

## Prerequisites

1. **Registered Business** - You need a registered business in Kenya
2. **M-Pesa Paybill/Till Number** - Active Safaricom M-Pesa business account
3. **Daraja Account** - Developer account at https://developer.safaricom.co.ke/

## Step 1: Get Production Credentials

### 1.1 Create Daraja Account
- Go to https://developer.safaricom.co.ke/
- Click "Sign Up" and create an account
- Verify your email

### 1.2 Apply for Production Access
- Log in to Daraja portal
- Go to "My Apps"
- Click "Create New App"
- Select "Lipa Na M-Pesa Online" API
- Fill in your business details:
  - Business Name
  - Business Registration Number
  - M-Pesa Paybill/Till Number
  - Contact Information

### 1.3 Get Your Credentials
Once approved, you'll receive:
- **Consumer Key** - Public identifier for your app
- **Consumer Secret** - Secret key for authentication
- **Passkey** - Encryption key for STK Push
- **Shortcode** - Your Paybill/Till number

## Step 2: Configure Production Environment

### 2.1 Update Environment Variables

For **local testing** with production credentials:
```bash
# .env.local
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_PASSKEY=your_production_passkey
MPESA_SHORTCODE=your_paybill_number
MPESA_ENVIRONMENT=production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For **production deployment** (Netlify/Vercel):
```bash
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_PASSKEY=your_production_passkey
MPESA_SHORTCODE=your_paybill_number
MPESA_ENVIRONMENT=production
NEXT_PUBLIC_BASE_URL=https://patronscup.mygolfhub.africa
```

### 2.2 Add to Netlify/Vercel

**Netlify:**
1. Go to Site Settings → Environment Variables
2. Add each variable above
3. Redeploy your site

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add each variable for "Production" environment
3. Redeploy

## Step 3: Configure Callback URL

### 3.1 Whitelist Your Domain
In Daraja portal:
1. Go to your app settings
2. Add callback URLs:
   - `https://patronscup.mygolfhub.africa/api/mpesa/callback`
   - `http://localhost:3000/api/mpesa/callback` (for testing)

### 3.2 Ensure HTTPS
- Production callback MUST use HTTPS
- Safaricom will reject HTTP callbacks in production

## Step 4: Test Production Payments

### 4.1 Test with Small Amount
```bash
# Use a real phone number
# Start with KES 1 to test
```

### 4.2 Verify Flow
1. User submits registration form
2. STK Push appears on their phone
3. User enters M-Pesa PIN
4. Payment processes
5. Callback updates database
6. Registration status changes to "completed"

### 4.3 Check Logs
Monitor:
- Browser console for frontend errors
- Server logs for API errors
- Supabase logs for database updates
- Daraja portal for transaction history

## Step 5: Go Live Checklist

- [ ] Production credentials obtained from Safaricom
- [ ] Environment variables configured
- [ ] Callback URL whitelisted in Daraja
- [ ] HTTPS enabled on production domain
- [ ] Test transaction completed successfully
- [ ] Database updates working
- [ ] Email notifications working (if configured)
- [ ] Error handling tested
- [ ] Refund process documented

## Common Issues

### Issue: "Invalid Access Token"
**Solution:** Check Consumer Key/Secret are correct for production

### Issue: "Invalid Shortcode"
**Solution:** Ensure shortcode matches your Paybill/Till number

### Issue: "Callback not received"
**Solution:** 
- Verify callback URL is whitelisted
- Check HTTPS is working
- Ensure server is publicly accessible

### Issue: "STK Push not appearing"
**Solution:**
- Verify phone number format (254XXXXXXXXX)
- Check user has M-Pesa registered
- Ensure sufficient balance for testing

## Sandbox vs Production Differences

| Feature | Sandbox | Production |
|---------|---------|------------|
| Base URL | sandbox.safaricom.co.ke | api.safaricom.co.ke |
| Credentials | Test credentials | Real business credentials |
| Phone Numbers | Test numbers only | Real phone numbers |
| Money | Simulated | Real money |
| Approval | Instant | Requires business verification |

## Security Best Practices

1. **Never commit credentials** - Use environment variables
2. **Rotate secrets regularly** - Change Consumer Secret periodically
3. **Monitor transactions** - Set up alerts for unusual activity
4. **Validate callbacks** - Verify callback authenticity
5. **Log everything** - Keep audit trail of all transactions
6. **Handle failures gracefully** - Implement retry logic
7. **Test refunds** - Have a refund process ready

## Support

- **Daraja Support:** support@safaricom.co.ke
- **Developer Portal:** https://developer.safaricom.co.ke/
- **Documentation:** https://developer.safaricom.co.ke/Documentation

## Next Steps

After production is working:
1. Set up transaction monitoring
2. Configure email notifications
3. Implement refund workflow
4. Add payment reconciliation
5. Set up automated reporting
