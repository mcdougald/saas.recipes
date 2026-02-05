# SaaS Recipes

A modern SaaS dashboard built with Next.js, TailwindCSS, and shadcn/ui in a Turborepo monorepo.

This project is currently hosted at [trev.fyi/saas](https://trev.fyi/saas)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS 4
- **UI Components**: shadcn/ui
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Authentication**: better-auth
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe

## Project Structure

```
.
├── apps/
│   └── web/              # Next.js web application
│       ├── src/
│       │   ├── app/      # App router pages
│       │   │   ├── dashboard/
│       │   │   │   ├── users/
│       │   │   │   ├── documents/
│       │   │   │   └── settings/
│       │   │   └── ...
│       │   ├── components/
│       │   │   ├── ui/   # shadcn/ui components
│       │   │   └── dashboard/
│       │   └── lib/      # Utility functions
│       └── ...
├── packages/             # Shared packages (future)
├── turbo.json           # Turborepo configuration
└── pnpm-workspace.yaml  # pnpm workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8.15+
- PostgreSQL database (see [Authentication Setup Guide](apps/web/AUTH_SETUP.md))

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up authentication and database:
   - Follow the [Authentication Setup Guide](apps/web/AUTH_SETUP.md) for detailed instructions
   - Copy `apps/web/.env.example` to `apps/web/.env` and configure your environment variables

3. Run database migrations:
```bash
cd apps/web
pnpm db:push
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
```

## Features

- 🎨 Modern dashboard layout with sidebar navigation
- 📱 Responsive design
- 🌙 Dark mode support (via shadcn/ui)
- 🚀 Fast development with Turbopack
- 📦 Monorepo structure for scalability
- 🎯 TypeScript for type safety
- 🔐 Authentication with email/password (better-auth)
- 💳 Subscription billing with Stripe
- 🗄️ PostgreSQL database with Drizzle ORM

## Design Inspiration

The dashboard layout is inspired by [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter), a comprehensive admin dashboard example built with Next.js and shadcn/ui.

## Dashboard Pages

- **Home**: Landing page with features and pricing
- **Sign In/Sign Up**: Authentication pages
- **Pricing**: Subscription plans with Stripe integration
- **Dashboard**: Overview with statistics and recent activity
- **Users**: User management table
- **Documents**: Document library
- **Settings**: Profile and notification settings

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build all apps for production
- `pnpm lint` - Run linting across all apps

## License

MIT
