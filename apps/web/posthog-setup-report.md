# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js App Router project. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ approach)
- **Server-side PostHog client** in `src/lib/posthog-server.ts` for API route tracking
- **Reverse proxy configuration** in `next.config.ts` to avoid ad blockers
- **User identification** integrated with your authentication flow
- **Custom event tracking** across authentication, subscriptions, and feature usage

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully completes the sign-up form and creates an account | `src/app/(auth)/sign-up/page.tsx` |
| `user_signed_in` | User successfully signs in via email/password form | `src/contexts/auth-context.tsx` |
| `user_signed_in_social` | User initiates social sign-in (Google or GitHub) | `src/features/auth/components/sign-in.tsx` |
| `user_logged_out` | User logs out of the application | `src/contexts/auth-context.tsx` |
| `password_reset_requested` | User requests a password reset email | `src/app/(auth)/forgot-password/page.tsx` |
| `pricing_plan_selected` | User clicks to select a pricing plan | `src/features/pricing/column-pricing.tsx` |
| `checkout_session_created` | Server-side: Checkout session successfully created | `src/app/api/stripe/create-checkout-session/route.ts` |
| `subscription_started` | Server-side: Stripe webhook confirms checkout completed | `src/app/api/stripe/webhook/route.ts` |
| `subscription_updated` | Server-side: Stripe webhook confirms subscription update | `src/app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Server-side: Stripe webhook confirms subscription cancellation | `src/app/api/stripe/webhook/route.ts` |
| `billing_portal_opened` | Server-side: User opened the Stripe billing portal | `src/app/api/stripe/create-portal-session/route.ts` |
| `ai_chat_message_sent` | User sends a message to the AI Chef assistant | `src/features/ai-chef/components/ai-chef.tsx` |
| `ai_chat_regenerate_clicked` | User clicks to regenerate an AI response | `src/features/ai-chef/components/ai-chef.tsx` |
| `task_created` | User creates a new task in the task management system | `src/features/tasks/components/add-task-modal.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/316132/dashboard/1285880)

### Insights
- [User Activation Funnel](https://us.posthog.com/project/316132/insights/RgBn4j1h) - Tracks user journey from sign up to first AI chat message
- [Subscription Conversion Funnel](https://us.posthog.com/project/316132/insights/JbqtRexy) - Tracks conversion from pricing page to successful subscription
- [AI Chef Daily Usage](https://us.posthog.com/project/316132/insights/7crhBv0T) - Tracks daily AI chat message volume over time
- [Subscription & Churn Trends](https://us.posthog.com/project/316132/insights/20Nrmt4q) - Weekly comparison of new subscriptions vs cancellations
- [User Growth & Daily Active Users](https://us.posthog.com/project/316132/insights/4uZrFm3r) - Daily new sign-ups and unique users signing in

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
