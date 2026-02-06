# saas.recipes – Agent context

## Project overview

**Purpose:** saas.recipes analyzes the best (fullstack) open-source(d) repositories. The analysis breaks down codebase structure, contributors, efforts, dependencies, and related signals to connect the *idea & product* to its *development*—so builders can see how real SaaS products are built and shipped.

**Metaphor:** The developer is “cooking” the SaaS idea in the “kitchen”: the service helps customers understand how a developer uses a framework, pipeline, and hardware to release a software product. Recipes = how to build; kitchen = the development environment and tooling.

**Benefits to end-users** (curated analysis + dashboards of open-sourced projects to clone/borrow from):
- **Discover & compare** – Find production-grade repos by stack, domain, or signal (contributors, activity, dependencies) instead of raw search.
- **Assess before adopting** – See codebase health, maintenance effort, and dependency risk in one place; decide what’s safe to fork or copy.
- **Shorten time-to-ship** – Reuse patterns, structure, and tooling from vetted projects instead of building from scratch.
- **Learn from real products** – Connect “how it was built” to “what it does”; use dashboards to study architecture and team effort.
- **Reduce lock-in and cost** – Choose proven OSS foundations and avoid reinventing or over-committing to unvetted choices.

**Tech:**
- **Monorepo**: pnpm workspaces + Turborepo. Root scripts: `pnpm dev`, `pnpm build`, `pnpm lint`.
- **Main app**: `apps/web` – Next.js 16, React 19, TypeScript, Tailwind CSS 4, Drizzle ORM, better-auth, Stripe.
- **Path alias**: In `apps/web`, `@/*` maps to `./src/*`.

## Terminology: Restaurant ↔ Development

Cross-map euphemisms and terms between cooking/serving and developing/deploying. Use for copy, UI labels, docs, and agent consistency.

| Restaurant / cooking / serving | Development / company |
|--------------------------------|------------------------|
| Recipe | Blueprint, how-to, stack, or implementation pattern |
| Kitchen | Dev environment; repo; CI/CD pipeline; tooling |
| Chef / cook | Developer; builder; engineer |
| Ingredient | Dependency; library; package; service |
| Prep / mise en place | Setup; scaffolding; boilerplate; config |
| Cook / bake | Build; compile; run (e.g. `pnpm build`) |
| Plate / serve | Deploy; release; ship |
| Menu | Product catalog; feature set; roadmap |
| Dish | Feature; product; app; service |
| Special / daily | Release; launch; sprint deliverable |
| Restaurant | Company; product org; “the product” |
| Dining room / front of house | Production; live app; customer-facing |
| Back of house | Backend; infra; internal tooling |
| Guest / diner | User; customer; end-user |
| Order | Request; ticket; feature request |
| Reservation | Booking; signup; commitment (e.g. waitlist) |
| Recipe book / cookbook | Docs; playbook; template repo; saas.recipes content |
| Curated / house-made | Curated; in-house; first-party; vetted OSS |
| Clone / borrow (a recipe) | Fork; clone; copy; adopt (a repo or pattern) |

## Conventions

- Use the repo’s existing ESLint and Prettier setup; don’t introduce new style tools without agreement.
- For React/Next.js patterns and performance, follow the guidance in **apps/web/.claude/skills/vercel-react-best-practices/AGENTS.md** when editing or adding code in `apps/web`.

## Commands

- From repo root: `pnpm dev` (runs turbo dev, e.g. Next.js), `pnpm build`, `pnpm lint`.
- From `apps/web`: `pnpm db:up`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`, `pnpm db:seed`.

## Stylish components (Aceternity, Magic UI)

For hero sections, auth layouts, marketing blocks, and refined UI, use components from:

- **Aceternity UI** – https://ui.aceternity.com (e.g. [Hero Highlight](https://ui.aceternity.com/components/hero-highlight), Spotlight, Aurora, Bento Grids). Install via: `npx shadcn@latest add @aceternity/<component-name>`.
- **Magic UI** – https://magicui.design – animated borders, gradients, blocks.

See **.cursor/rules/stylish-components.mdc** for installation, conventions, and where to place components in `apps/web`.
