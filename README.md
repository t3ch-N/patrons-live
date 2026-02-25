This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment & Future Plans

### Quick Deploy to Production

**Deploy to `patronscup.mygolfhub.africa`:**

1. **Pre-deployment check:**
   ```bash
   # Windows
   .\deploy-check.ps1
   
   # Unix/Mac
   ./deploy-check.sh
   ```

2. **Push to Git and deploy:**
   ```bash
   git push origin main
   ```

3. **Configure DNS:**
   - Add CNAME record: `patronscup` → `<your-site>.netlify.app`
   - See `DNS_SETUP_GUIDE.md` for detailed instructions

4. **Verify:**
   - Visit: https://patronscup.mygolfhub.africa
   - Check HTTPS is working
   - Test all features

### Documentation

- 📖 **[QUICK_START.md](./QUICK_START.md)** - TL;DR deployment guide
- 🚀 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- 🌐 **[DNS_SETUP_GUIDE.md](./DNS_SETUP_GUIDE.md)** - DNS configuration help
- 🏗️ **[MULTI_TOURNAMENT_HUB_PLAN.md](./MULTI_TOURNAMENT_HUB_PLAN.md)** - Future multi-tournament platform architecture
- 💻 **[MAIN_HUB_STARTER.md](./MAIN_HUB_STARTER.md)** - Implementation guide for main hub

### Future: Multi-Tournament Platform

This app is designed to be integrated into a larger platform:

```
mygolfhub.africa (Main Hub - Future)
├── / (Tournament listings)
├── /tournaments/patrons-cup-2026 (This app)
├── /tournaments/karen-stableford-2026
├── /tournaments/nancy-millar-2026
└── /admin (CMS Dashboard)
```

**Key Features:**
- ✅ Database already multi-tournament ready
- ✅ Slug-based routing for easy integration
- ✅ Reusable components for other tournaments
- ✅ Centralized CMS for managing all tournaments

See `MULTI_TOURNAMENT_HUB_PLAN.md` for complete architecture details.
