import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const caseStudies = [
  {
    title: "From Monolith to Modular Monolith",
    challenge:
      "A team needed faster feature delivery but could not absorb microservice overhead.",
    outcome:
      "They introduced domain boundaries and internal APIs, cutting change lead-time by 35%.",
    takeaways: ["Feature ownership", "Boundary contracts", "Incremental migration"],
  },
  {
    title: "Stabilizing Billing Workflows",
    challenge:
      "Payment retries and webhooks caused duplicate state changes during peak periods.",
    outcome:
      "Idempotent handlers and queue-backed processing reduced billing incidents by 60%.",
    takeaways: ["Idempotency keys", "Async processing", "Operational dashboards"],
  },
  {
    title: "Hardening Multi-tenant Security",
    challenge:
      "Authorization rules were inconsistent across API handlers and background jobs.",
    outcome:
      "Central policy checks and audit logs improved incident response and tenant safety.",
    takeaways: ["Policy layer", "Least privilege", "Auditability"],
  },
];

export default function LearnCaseStudiesPage() {
  return (
    <>
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground">
            Real implementation stories that connect architecture decisions to
            business outcomes.
          </p>
        </div>
      </div>

      <div className="@container/main grid gap-6 px-4 pb-6 lg:px-6 md:grid-cols-2 xl:grid-cols-3">
        {caseStudies.map((study) => (
          <Card key={study.title} className="border">
            <CardHeader className="space-y-2">
              <CardTitle>{study.title}</CardTitle>
              <CardDescription>{study.challenge}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{study.outcome}</p>
              <div className="flex flex-wrap gap-2">
                {study.takeaways.map((takeaway) => (
                  <Badge key={takeaway} variant="outline">
                    {takeaway}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
