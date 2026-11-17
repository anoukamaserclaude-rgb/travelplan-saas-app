# TravelPlan SaaS

TravelPlan is a professional travel planning SaaS built with Next.js, Prisma, SQLite, and NextAuth.

## Features
- User authentication and personalized dashboard
- Travel creation with destination, dates, travelers
- Daily activity planning
- Budget and expense management
- Hotel, flight, and transport reservations
- Luggage checklist
- Travel calendar and reminders
- Travel sharing with collaborators
- Subscription plans: Free, Premium, Pro
- Admin dashboard for users, plans, and stats
- Responsive dark-blue UI

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client and initialize database:
   ```bash
   npm run db:generate
   npm run db:push
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Production deployment
- Deploy on Vercel or any Node-compatible platform.
- Use Postgres for production if desired.
- Set NEXTAUTH_URL and NEXTAUTH_SECRET in environment variables.

## Backup
```bash
npm run backup:db
```
