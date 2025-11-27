# 🔑 API Keys Setup Guide

This guide will walk you through obtaining all the necessary API keys for the AI Investor application.

---

## 📋 Table of Contents

1. [Claude API (Anthropic)](#1-claude-api-anthropic)
2. [Google Gemini API](#2-google-gemini-api)
3. [Financial Modeling Prep API](#3-financial-modeling-prep-api)
4. [Stripe Payment Keys](#4-stripe-payment-keys)
5. [Clerk Authentication](#5-clerk-authentication)
6. [Neon PostgreSQL Database](#6-neon-postgresql-database)
7. [Environment Setup](#7-environment-setup)

---

## 1. Claude API (Anthropic)

**Purpose:** AI-powered investment analysis using Claude's advanced language model.

### Steps to Get the API Key:

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to **Settings** → **API Keys**
4. Click **"Create Key"**
5. Copy the API key (it won't be shown again!)
6. Add to `.env.local`:
   ```
   CLAUDE_API_KEY=sk-ant-api03-...
   ```

### Pricing:
- **Pay-as-you-go:** No monthly fee, only pay for what you use
- Claude 3.7 Sonnet: ~$3 per million input tokens
- Free tier: $5 credit for new users

### Documentation:
- [Anthropic API Docs](https://docs.anthropic.com/)

---

## 2. Google Gemini API

**Purpose:** Alternative AI model for investment analysis (free tier available).

### Steps to Get the API Key:

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the generated API key
6. Add to `.env.local`:
   ```
   GEMINI_API_KEY=AIzaSy...
   ```

### Pricing:
- **Free tier:** 15 requests per minute, 1500 requests per day
- **Paid tier:** Available through Google Cloud

### Documentation:
- [Gemini API Documentation](https://ai.google.dev/docs)

---

## 3. Financial Modeling Prep API

**Purpose:** Fetch real-time stock data, financial statements, and market information.

### Steps to Get the API Key:

1. Visit [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs)
2. Click **"Get your Free API Key"** or **"Sign Up"**
3. Create an account with your email
4. Verify your email address
5. Log in and navigate to **Dashboard**
6. Copy your API key
7. Add to `.env.local`:
   ```
   FMP_API_KEY=your_api_key_here
   ```

### Free Tier Limits:
- **250 API calls per day**
- Real-time stock quotes
- Historical data
- Financial statements

### Paid Plans:
- Starter: $14/month (750 calls/day)
- Professional: $99/month (Unlimited calls)

### Documentation:
- [FMP API Documentation](https://site.financialmodelingprep.com/developer/docs)

---

## 4. Stripe Payment Keys

**Purpose:** Handle payments and token purchases.

### Steps to Get the API Keys:

1. Visit [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in
3. Navigate to **Developers** → **API Keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...` or `pk_live_...`)
   - **Secret key** (starts with `sk_test_...` or `sk_live_...`)

5. Add to `.env.local`:
   ```
   STRIPE_SECRET_API_KEY=sk_test_...
   NEXT_PUBLIC_PUBLISHABLE_STRIPE_API_KEY=pk_test_...
   ```

### Webhook Setup:

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe`
   - For local development: Use [Stripe CLI](https://stripe.com/docs/stripe-cli)
4. Select events to listen for:
   - `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Testing Mode:
- Use **test keys** during development (prefix: `sk_test_`, `pk_test_`)
- Use test card: `4242 4242 4242 4242` (any future date, any CVC)

### Documentation:
- [Stripe API Documentation](https://stripe.com/docs/api)

---

## 5. Clerk Authentication

**Purpose:** User authentication and management.

### Steps to Get the API Keys:

1. Visit [Clerk Dashboard](https://dashboard.clerk.com/)
2. Sign up or log in
3. Click **"Create Application"** or select your existing app
4. Go to **API Keys** in the sidebar
5. You'll see:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

6. Add to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

### Free Tier:
- **5,000 monthly active users**
- Email & password authentication
- Social logins (Google, GitHub, etc.)
- User management dashboard

### Documentation:
- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)

---

## 6. Neon PostgreSQL Database

**Purpose:** Store user data, reports, and transactions.

### Steps to Get the Database URL:

1. Visit [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Click **"Create Project"**
4. Choose a project name and region
5. After creation, go to **Dashboard**
6. Under **Connection Details**, you'll see the connection string
7. Copy the **Pooled connection** (recommended for serverless)
8. Add to `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

### Free Tier:
- **0.5 GB storage**
- 1 database
- Unlimited queries
- Auto-suspend after inactivity

### Running Migrations:

After setting up the database, run:
```bash
npm run db:generate
npm run db:migrate
```

### Documentation:
- [Neon Documentation](https://neon.tech/docs/introduction)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

---

## 7. Environment Setup

### Step 1: Copy the Example File

```bash
cp .env.example .env.local
```

### Step 2: Fill in Your API Keys

Open `.env.local` and replace all placeholder values with your actual API keys.

### Step 3: Verify Your Setup

Make sure all required variables are set:

```bash
# Check if all variables are present (Linux/Mac)
grep -v '^#' .env.local | grep -v '^$'

# Or manually verify each key is filled
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Run Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

### Step 6: Start the Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:3000`

---

## 🚨 Important Security Notes

1. **Never commit `.env.local` to version control**
   - It's already in `.gitignore`
   - Only commit `.env.example`

2. **Use different keys for development and production**
   - Keep test keys for development
   - Use production keys only in production environment

3. **Rotate keys if exposed**
   - If you accidentally expose a key, revoke it immediately
   - Generate a new key from the respective service

4. **Use environment variables in production**
   - Vercel: Add in **Settings** → **Environment Variables**
   - Other platforms: Use their specific env variable system

---

## 🆘 Troubleshooting

### Common Issues:

1. **"API Key not found" error:**
   - Make sure `.env.local` is in the root directory
   - Restart the dev server after adding new variables

2. **Database connection errors:**
   - Verify the DATABASE_URL format
   - Check if SSL mode is required (`?sslmode=require`)

3. **Stripe webhook not working locally:**
   - Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
   - Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

4. **Rate limiting issues:**
   - FMP free tier: 250 calls/day (implement caching)
   - Gemini free tier: 15 RPM, 1500 RPD
   - Claude: Pay-as-you-go (no hard limits)

---

## 📞 Support

- **Claude:** [support@anthropic.com](mailto:support@anthropic.com)
- **Gemini:** [Google AI Support](https://support.google.com/)
- **FMP:** [support@financialmodelingprep.com](mailto:support@financialmodelingprep.com)
- **Stripe:** [Stripe Support](https://support.stripe.com/)
- **Clerk:** [Clerk Support](https://clerk.com/support)
- **Neon:** [Neon Support](https://neon.tech/docs/introduction/support)

---

## ✅ Checklist

Before running the app, make sure you have:

- [ ] Created a `.env.local` file from `.env.example`
- [ ] Obtained Claude API key
- [ ] Obtained Gemini API key
- [ ] Obtained FMP API key
- [ ] Set up Stripe keys (all 3: secret, publishable, webhook)
- [ ] Set up Clerk authentication keys
- [ ] Created Neon PostgreSQL database
- [ ] Set NEXT_PUBLIC_SERVER_URL to your domain
- [ ] Run `npm install`
- [ ] Run database migrations (`npm run db:generate` and `npm run db:migrate`)
- [ ] Tested the app locally (`npm run dev`)

---

**🎉 You're all set! Happy investing!**
