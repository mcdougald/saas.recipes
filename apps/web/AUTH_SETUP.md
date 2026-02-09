# Authentication & Subscription Setup Guide

This guide will help you set up authentication with better-auth and subscription billing with Stripe.

## Prerequisites

- PostgreSQL database (local or hosted like Neon, Supabase, etc.)
- Stripe account for payments

## Step 1: Database Setup

### 1.1 Set up PostgreSQL Database

You can use any PostgreSQL provider:

- **Local**: Install PostgreSQL locally
- **Neon**: https://neon.tech (recommended for development)
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

### 1.2 Configure Environment Variables

Create a `.env` file in the `apps/web` directory:

```bash
cp .env.example .env
```

Update the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-at-least-32-characters-long"
BETTER_AUTH_URL="http://localhost:4000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:4000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Set after configuring webhook
STRIPE_PRO_MONTHLY_PRICE_ID="price_..." # Set after creating products
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID="price_..." # Set after creating products

# App
NEXT_PUBLIC_APP_URL="http://localhost:4000"
```

### 1.3 Generate a Better Auth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

### 1.4 Run Database Migrations

Generate and push the schema to your database:

```bash
cd apps/web
pnpm db:push
```

This will create all necessary tables for authentication and subscriptions.

## Step 2: Stripe Setup

### 2.1 Create Stripe Products

1. Go to https://dashboard.stripe.com/test/products
2. Create two products:

**Pro Plan**

- Name: "Pro"
- Price: $19.00/month
- Copy the Price ID and set it as `STRIPE_PRO_MONTHLY_PRICE_ID`

**Enterprise Plan**

- Name: "Enterprise"
- Price: $49.00/month
- Copy the Price ID and set it as `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID`

### 2.2 Configure Stripe Webhook

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run the following command to forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:4000/api/stripe/webhook
```

3. Copy the webhook signing secret (`whsec_...`) and set it as `STRIPE_WEBHOOK_SECRET`

**For production:**

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret

## Step 3: Start the Application

```bash
pnpm dev
```

The application will be available at http://localhost:4000

## Testing the Integration

### Test Authentication

1. Go to http://localhost:4000/sign-up
2. Create a new account
3. Sign in at http://localhost:4000/sign-in
4. You should be redirected to the dashboard

### Test Subscription

1. Sign in to your account
2. Go to http://localhost:4000/pricing
3. Click "Start Free Trial" on the Pro or Enterprise plan
4. Use Stripe test card: `4242 4242 4242 4242`
   - Use any future expiry date
   - Use any 3-digit CVC
   - Use any postal code
5. Complete the checkout
6. You should be redirected back to the dashboard

### Test Webhook Events

With Stripe CLI running, complete a subscription and check your terminal for webhook events.

## Production Deployment

### Environment Variables

Set all the same environment variables in your production environment, but:

- Use production database URL
- Use production Stripe keys (starting with `pk_live_` and `sk_live_`)
- Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain
- Generate a new `BETTER_AUTH_SECRET` for production

### Database Migrations

Run migrations in production:

```bash
pnpm db:push
```

### Stripe Configuration

1. Switch to live mode in Stripe dashboard
2. Create live products and copy the price IDs
3. Configure live webhook endpoint
4. Update environment variables with live keys

## Database Management

### View Database (Drizzle Studio)

```bash
pnpm db:studio
```

This opens a visual database browser at http://localhost:4983

### Generate Migrations

If you modify the schema:

```bash
pnpm db:generate
```

### Run Migrations

```bash
pnpm db:migrate
```

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check if your database is running
- Ensure your IP is whitelisted (for cloud databases)

### Stripe Webhook Issues

- Make sure Stripe CLI is running for local development
- Verify webhook secret is correct
- Check webhook logs in Stripe dashboard

### Authentication Issues

- Clear browser cookies and try again
- Check if `BETTER_AUTH_SECRET` is set correctly
- Verify database tables were created

## Security Notes

- Never commit `.env` file to version control
- Use strong, unique secrets for production
- Enable email verification in production (set `requireEmailVerification: true` in auth config)
- Consider adding rate limiting for auth endpoints
- Use HTTPS in production

## Additional Resources

- Better Auth Documentation: https://www.better-auth.com/docs
- Drizzle ORM Documentation: https://orm.drizzle.team/docs
- Stripe Documentation: https://stripe.com/docs
