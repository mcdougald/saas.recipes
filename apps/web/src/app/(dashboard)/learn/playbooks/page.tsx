import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Code2, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";

type Snippet = {
  title: string;
  category: string;
  stack: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  scenario: string;
  focus: string;
  code: string;
  tags: string[];
};

const snippets: Snippet[] = [
  {
    title: "Feature flag guard with progressive rollout",
    category: "Architecture",
    stack: "Next.js + PostHog",
    level: "Intermediate",
    scenario:
      "Ship risky features to small cohorts first, with a fast rollback path.",
    focus: "Server-side gating + deterministic bucketing to avoid hydration drift.",
    code: `export async function isEnabled(userId: string) {
  const flag = await posthog.isFeatureEnabled("new-editor", userId);
  if (!flag) return false;

  const bucket = hash(userId) % 100;
  return bucket < 20; // 20% rollout
}`,
    tags: ["feature-flags", "experimentation", "release-safety"],
  },
  {
    title: "Idempotent Stripe webhook handler",
    category: "Billing",
    stack: "Node.js + Stripe + Drizzle",
    level: "Advanced",
    scenario: "Prevent duplicate side-effects when webhooks are retried.",
    focus: "Persist processed event ids before mutating subscription state.",
    code: `const eventId = event.id;
const alreadyProcessed = await db.query.webhookEvents.findFirst({
  where: eq(webhookEvents.id, eventId),
});
if (alreadyProcessed) return new Response("ok");

await db.transaction(async (tx) => {
  await tx.insert(webhookEvents).values({ id: eventId });
  await syncSubscription(tx, event.data.object);
});`,
    tags: ["billing", "idempotency", "transactions"],
  },
  {
    title: "Typed env validation for production safety",
    category: "Operations",
    stack: "TypeScript + Zod",
    level: "Beginner",
    scenario: "Fail fast on misconfigured environments during deploys.",
    focus: "Single typed env contract shared by app and workers.",
    code: `const schema = z.object({
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1),
  APP_BASE_URL: z.string().url(),
});

export const env = schema.parse(process.env);`,
    tags: ["runtime-safety", "configuration", "deployment"],
  },
  {
    title: "Route segment auth with role-scoped access",
    category: "Security",
    stack: "Next.js + better-auth",
    level: "Intermediate",
    scenario: "Protect high-value pages and APIs with minimal duplication.",
    focus: "Single authorization utility reused by routes, pages, and actions.",
    code: `export async function requireRole(role: "admin" | "member") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthenticated");
  if (session.user.role !== role) throw new Error("Unauthorized");
  return session.user;
}`,
    tags: ["auth", "rbac", "server-actions"],
  },
];

const roadmap = [
  "Search by stack, use case, and complexity.",
  "Diff two snippet implementations side-by-side.",
  "Attach each snippet to full recipe case studies.",
  "Export snippets as starter files for your team.",
];

export default function LearnPlaybooksPage() {
  const categoryCount = new Set(snippets.map((snippet) => snippet.category)).size;

  return (
    <>
      <div className="px-4 py-4 lg:px-6">
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 lg:p-8">
          <div
            aria-hidden
            className="absolute -left-10 top-0 size-40 rounded-full bg-primary/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-10 right-0 size-44 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="relative flex flex-col gap-5">
            <Badge variant="outline" className="w-fit gap-1.5">
              <Sparkles aria-hidden className="size-3.5" />
              Premium library in progress
            </Badge>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                Snippet Library
              </h1>
              <p className="max-w-3xl text-muted-foreground">
                Practical, production-style code blocks you can map directly to
                your SaaS roadmap. Each snippet includes context, implementation
                focus, and clear upgrade paths to full premium breakdowns.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{snippets.length} snippet previews</Badge>
              <Badge variant="secondary">{categoryCount} core categories</Badge>
              <Badge variant="secondary" className="gap-1">
                <LockKeyhole aria-hidden className="size-3.5" />
                Full repository examples in premium
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/pricing">
                  Unlock premium snippets
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/learn">Browse learning tracks</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
        <Card className="border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 aria-hidden className="size-5 text-primary" />
              Real-world code examples
            </CardTitle>
            <CardDescription>
              Curated snippet previews that mirror patterns from production SaaS
              repositories.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {snippets.map((snippet) => (
              <div
                key={snippet.title}
                className="rounded-lg border border-border/70 bg-background p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-5">{snippet.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {snippet.scenario}
                    </p>
                  </div>
                  <Badge variant="outline">{snippet.level}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{snippet.category}</Badge>
                  <Badge variant="secondary">{snippet.stack}</Badge>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  Focus: {snippet.focus}
                </p>

                <pre className="mt-3 overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs leading-5 text-foreground">
                  <code>{snippet.code}</code>
                </pre>

                <div className="mt-3 flex flex-wrap gap-2">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>What premium unlocks next</CardTitle>
            <CardDescription>
              This page is the starting shell for a richer, searchable snippet
              product.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              {roadmap.map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <span className="text-muted-foreground">{item}</span>
                </p>
              ))}
            </div>

            <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
              <div className="space-y-2">
                <p className="font-semibold">Designed for premium learning paths</p>
                <p className="text-sm text-muted-foreground">
                  Upcoming releases will connect snippet previews to deeper
                  architecture notes, implementation trade-offs, and full
                  production references.
                </p>
              </div>
              <Button asChild className="mt-4 w-full sm:w-auto">
                <Link href="/pricing">
                  View premium plans
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
