import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const playbooks = [
  {
    title: "Launch Readiness Playbook",
    objective: "Ship your first production release with measurable confidence.",
    steps: [
      "Define quality gates (tests, lint, typecheck, smoke checks).",
      "Set up preview environment reviews across product, design, and QA.",
      "Prepare rollback and communication plan before release.",
    ],
  },
  {
    title: "Growth Experiment Playbook",
    objective: "Run fast product experiments without hurting core stability.",
    steps: [
      "Isolate experiment config behind feature flags.",
      "Track one success metric and one guardrail metric per experiment.",
      "Archive learnings and codify reusable implementation patterns.",
    ],
  },
  {
    title: "Incident Response Playbook",
    objective: "Respond quickly and learn from outages or degraded service.",
    steps: [
      "Create severity levels with clear ownership and escalation rules.",
      "Capture timeline, root cause, and customer impact in one template.",
      "Prioritize follow-up fixes by risk reduction, not effort alone.",
    ],
  },
];

export default function LearnPlaybooksPage() {
  return (
    <>
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Recipe Playbooks</h1>
          <p className="text-muted-foreground">
            Repeatable execution workflows inspired by proven SaaS codebases.
          </p>
        </div>
      </div>

      <div className="@container/main space-y-6 px-4 lg:px-6 pb-6">
        {playbooks.map((playbook) => (
          <Card key={playbook.title} className="border">
            <CardHeader>
              <CardTitle>{playbook.title}</CardTitle>
              <CardDescription>{playbook.objective}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {playbook.steps.map((step) => (
                <p key={step} className="text-sm text-muted-foreground">
                  - {step}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
