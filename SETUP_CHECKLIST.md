# Setup Checklist

Use this checklist when setting up the authentication and subscription system for the first time.

## Prerequisites Setup

- [ ] PostgreSQL database created (Neon, Supabase, Railway, or local)
- [ ] Stripe account created (use test mode for development)
- [ ] Node.js 18+ installed
- [ ] pnpm 8.15+ installed

## Environment Configuration

- [ ] Copy `.env.example` to `.env` in `apps/web/`
- [ ] Set `DATABASE_URL` with your PostgreSQL connection string
- [ ] Generate `BETTER_AUTH_SECRET` using `openssl rand -base64 32`
- [ ] Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` (usually `http://localhost:4000`)
- [ ] Set `NEXT_PUBLIC_APP_URL` (usually `http://localhost:4000`)

## Stripe Configuration

- [ ] Get Stripe test API keys from https://dashboard.stripe.com/test/apikeys
- [ ] Set `STRIPE_SECRET_KEY` (starts with `sk_test_`)
- [ ] Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)
- [ ] Create "Pro" product in Stripe dashboard ($19/month)
- [ ] Create "Enterprise" product in Stripe dashboard ($49/month)
- [ ] Copy Pro price ID to `STRIPE_PRO_MONTHLY_PRICE_ID`
- [ ] Copy Enterprise price ID to `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID`

## Stripe Webhook Setup

### Development (Local)

- [ ] Install Stripe CLI: https://stripe.com/docs/stripe-cli
- [ ] Run `stripe listen --forward-to localhost:4000/api/stripe/webhook`
- [ ] Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Production

- [ ] Add webhook endpoint in Stripe dashboard: `https://yourdomain.com/api/stripe/webhook`
- [ ] Select events: `checkout.session.completed`, `customer.subscription.*`
- [ ] Copy webhook signing secret to production `STRIPE_WEBHOOK_SECRET`

## Database Setup

- [ ] Navigate to `apps/web/` directory
- [ ] Run `pnpm install` to install dependencies
- [ ] Run `pnpm db:push` to create database tables
- [ ] Verify tables created using `pnpm db:studio`

## Application Testing

### Authentication Flow

- [ ] Start dev server: `pnpm dev`
- [ ] Visit http://localhost:4000
- [ ] Click "Sign in" - verify sign-in page loads
- [ ] Try to sign in with non-existent account - should show error
- [ ] Click "Sign up" link
- [ ] Create a new account with email and password
- [ ] Verify redirect to dashboard after sign-up
- [ ] Verify user name/email appears in sidebar
- [ ] Click user menu and sign out
- [ ] Verify redirect to sign-in page
- [ ] Sign in with created account
- [ ] Verify successful login

### Subscription Flow

- [ ] While signed in, navigate to /pricing
- [ ] Click "Start Free Trial" on Pro plan
- [ ] Verify redirect to Stripe Checkout
- [ ] Use test card: `4242 4242 4242 4242`
  - Any future expiry date
  - Any 3-digit CVC
  - Any postal code
- [ ] Complete checkout
- [ ] Verify redirect back to dashboard with success message
- [ ] Check Stripe CLI output for webhook events
- [ ] Verify subscription created in `pnpm db:studio`

### Customer Portal

- [ ] Navigate to /dashboard/settings (or wherever you add the portal link)
- [ ] Click "Manage Subscription" (needs to be added to UI)
- [ ] Verify redirect to Stripe Customer Portal
- [ ] Try canceling subscription
- [ ] Verify webhook received in Stripe CLI

## Production Deployment Checklist

- [ ] Set all environment variables in production environment
- [ ] Use production database URL
- [ ] Use production Stripe keys (live mode)
- [ ] Set production `BETTER_AUTH_URL` to your domain
- [ ] Set production `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Generate new `BETTER_AUTH_SECRET` for production
- [ ] Run `pnpm db:push` in production
- [ ] Configure Stripe webhook for production domain
- [ ] Enable email verification in `src/lib/auth.ts`
- [ ] Set up email service (SendGrid, Resend, etc.)
- [ ] Test complete flow in production

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] All secrets are unique and randomly generated
- [ ] Production uses HTTPS
- [ ] Email verification enabled in production
- [ ] Rate limiting configured for auth endpoints (optional but recommended)
- [ ] Database connection uses SSL (if cloud-hosted)
- [ ] Stripe webhook signatures verified
- [ ] All API routes have proper authentication checks

## Common Issues

### "DATABASE_URL environment variable is not set"

- Verify `.env` file exists in `apps/web/`
- Check `DATABASE_URL` is set correctly
- Restart development server after changing `.env`

### Stripe Checkout not working

- Verify Stripe publishable key is set
- Check browser console for errors
- Ensure you're using test mode keys for development

### Webhook not receiving events

- Ensure Stripe CLI is running with `stripe listen`
- Check webhook secret matches CLI output
- Verify webhook endpoint is correct

### Build fails with environment variable errors

- This is expected if environment variables aren't set
- For CI/CD, the build is designed to succeed without env vars
- Runtime API routes will fail gracefully if not configured

## Next Steps

After successful setup:

1. Customize pricing tiers and features
2. Add subscription status indicators in the UI
3. Implement subscription-based feature gating
4. Add customer portal link to settings page
5. Set up email notifications
6. Add social authentication providers (optional)
7. Customize email templates
8. Add analytics tracking
9. Implement usage limits per tier
10. Add billing history page

## Support

- Better Auth Docs: https://www.better-auth.com/docs
- Drizzle ORM Docs: https://orm.drizzle.team/docs
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs

For issues with this implementation, check:

- IMPLEMENTATION_SUMMARY.md for technical details
- AUTH_SETUP.md for detailed setup instructions
