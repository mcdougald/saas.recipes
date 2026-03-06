"use client";

import { Badge } from "@/components/ui/badge";
import type { HelpFAQItemId } from "@/features/help-center/help-center-data";

/**
 * Props passed to FAQ answer renderer components.
 */
export interface FAQAnswerComponentProps {
  answer: string;
}

type FAQAnswerComponent = (props: FAQAnswerComponentProps) => JSX.Element;

const PlainAnswer: FAQAnswerComponent = ({ answer }) => <p>{answer}</p>;

function SimilarProjectsLandscapeAnswer() {
  return (
    <div className="space-y-4">
      <p>
        These tools overlap with saas.recipes in repository analysis, but each one
        is optimized for a different workflow.
      </p>

      <div className="grid gap-2">
        <article className="rounded-md border border-border/70 bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <strong className="text-foreground text-sm">getstack</strong>
            <Badge variant="secondary" className="h-5 px-2 text-[11px]">
              Stack visuals
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Strong at repository technology detection and visualization, with broad
            language and package scanning coverage.
          </p>
          <a
            href="https://getstack.dev/licenses"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block text-xs font-medium"
          >
            Open getstack
          </a>
        </article>

        <article className="rounded-md border border-border/70 bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <strong className="text-foreground text-sm">repo-doctor</strong>
            <Badge variant="secondary" className="h-5 px-2 text-[11px]">
              Self-hosted analysis
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            A Copilot SDK repository assistant that is ideal when you want control
            of analysis in your own environment.
          </p>
          <a
            href="https://github.com/glaucia86/repo-doctor"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block text-xs font-medium"
          >
            Open repo-doctor
          </a>
        </article>

        <article className="rounded-md border border-border/70 bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <strong className="text-foreground text-sm">Devfolios</strong>
            <Badge variant="secondary" className="h-5 px-2 text-[11px]">
              Portfolio output
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Presentation-first tooling that turns JSON data into portfolio websites
            rendered in iframe layouts.
          </p>
          <a
            href="https://github.com/NotStark/Devfolios"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block text-xs font-medium"
          >
            Open Devfolios
          </a>
        </article>

        <article className="rounded-md border border-border/70 bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <strong className="text-foreground text-sm">stack-analyser</strong>
            <Badge variant="secondary" className="h-5 px-2 text-[11px]">
              Stack classification
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Focused on extracting and classifying technologies in codebases for
            teams that need a stack inventory quickly.
          </p>
          <a
            href="https://github.com/specfy/stack-analyser"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block text-xs font-medium"
          >
            Open stack-analyser
          </a>
        </article>
      </div>

      <p className="text-muted-foreground text-sm">
        Use these tools for detection or local analysis, then use saas.recipes to
        understand how product features map to architecture choices and which
        implementation patterns are easiest to reuse.
      </p>
    </div>
  );
}

/**
 * FAQ answer component map keyed by FAQ item id.
 *
 * Keeping this record exhaustive ensures answer-rendering components stay in sync
 * with ids defined in `help-center-data.ts`.
 */
export const FAQ_ANSWER_COMPONENTS: Record<HelpFAQItemId, FAQAnswerComponent> = {
  "create-account": PlainAnswer,
  "included-in-each-plan": PlainAnswer,
  "how-to-get-started": PlainAnswer,
  "where-to-learn-platform": PlainAnswer,
  "similar-projects-landscape": SimilarProjectsLandscapeAnswer,
  "what-are-recipes": PlainAnswer,
  "reuse-recipe-code": PlainAnswer,
  "how-projects-selected": PlainAnswer,
  "change-password": PlainAnswer,
  "change-email-address": PlainAnswer,
  "enable-2fa": PlainAnswer,
  "team-account-sharing": PlainAnswer,
  "accepted-payment-methods": PlainAnswer,
  "cancel-anytime": PlainAnswer,
  "refund-policy": PlainAnswer,
  "upgrade-downgrade-workflow": PlainAnswer,
};

/**
 * Resolve the renderer component for a given FAQ item id.
 *
 * @param faqId - FAQ item identifier from help-center data.
 * @returns A component that renders the FAQ answer content.
 */
export function getFAQAnswerComponent(faqId: string): FAQAnswerComponent {
  return FAQ_ANSWER_COMPONENTS[faqId as HelpFAQItemId] ?? PlainAnswer;
}
