"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpFAQSection } from "@/features/help-center/help-center-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenText, CreditCard, Settings2, Sparkles } from "lucide-react";
import { getFAQAnswerComponent } from "@/features/help-center/components/faq-answer-components";

const faqSectionIconMap = {
  "getting-started": Sparkles,
  "recipes-content": BookOpenText,
  "account-settings": Settings2,
  "billing-payments": CreditCard,
} as const;

/**
 * Props for the FAQ accordion section.
 */
interface FAQAccordionProps {
  faqSections: readonly HelpFAQSection[];
  searchQuery: string;
  activeItemValue?: string | null;
  onActiveItemChange?: (value: string | null) => void;
}

/**
 * Sectioned FAQ accordion with optional filtered state.
 */
export function FAQAccordion({
  faqSections,
  searchQuery,
  activeItemValue,
  onActiveItemChange,
}: FAQAccordionProps) {
  const totalFaqQuestions = faqSections.reduce(
    (count, section) => count + section.questions.length,
    0,
  );

  return (
    <div id="faq" className="scroll-mt-6 space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-sm">
          Quick answers for onboarding, billing, accounts, and similar-project
          research workflows.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="h-6 px-2">
            {faqSections.length} sections
          </Badge>
          <Badge variant="secondary" className="h-6 px-2">
            {totalFaqQuestions} questions
          </Badge>
        </div>
      </div>

      {faqSections.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {faqSections.map((section) => {
            const SectionIcon =
              faqSectionIconMap[section.id as keyof typeof faqSectionIconMap] ??
              Sparkles;

            return (
              <Card
                key={section.id}
                className="border-border/70 bg-linear-to-b from-card via-card to-muted/25 shadow-sm"
              >
                <CardHeader className="border-b border-border/70 bg-muted/30 pb-3!">
                  <CardTitle className="flex items-center justify-between gap-3 text-base">
                    <span className="inline-flex items-center gap-2">
                      <SectionIcon className="text-muted-foreground size-4" />
                      {section.category}
                    </span>
                    <span className="text-muted-foreground rounded-full border bg-background px-2 py-0.5 text-xs font-medium">
                      {section.questions.length} Q
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                    value={
                      activeItemValue?.startsWith(`${section.id}-`)
                        ? activeItemValue
                        : undefined
                    }
                    onValueChange={(value) =>
                      onActiveItemChange?.(value.length > 0 ? value : null)
                    }
                  >
                    {section.questions.map((faq) => {
                      const AnswerComponent = getFAQAnswerComponent(faq.id);

                      return (
                        <AccordionItem
                          key={faq.id}
                          value={`${section.id}-${faq.id}`}
                          id={`faq-${section.id}-${faq.id}`}
                          className="last:border-b group overflow-hidden rounded-md border border-border/70 bg-background px-4 shadow-xs transition-colors hover:border-border data-[state=open]:border-primary/40"
                        >
                          <AccordionTrigger className="text-left text-sm font-medium leading-snug hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline">
                            <AnswerComponent answer={faq.answer} />
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No FAQ entries match{" "}
            <span className="font-medium">&quot;{searchQuery}&quot;</span>.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
