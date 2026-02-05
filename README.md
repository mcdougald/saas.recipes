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

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## Dashboard Pages

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
