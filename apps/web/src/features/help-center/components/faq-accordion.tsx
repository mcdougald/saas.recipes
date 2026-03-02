"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpFAQSection } from "@/features/help-center/help-center-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Props for the FAQ accordion section.
 */
interface FAQAccordionProps {
  faqSections: HelpFAQSection[];
  searchQuery: string;
}

/**
 * Sectioned FAQ accordion with optional filtered state.
 */
export function FAQAccordion({ faqSections, searchQuery }: FAQAccordionProps) {
  return (
    <div id="faq" className="scroll-mt-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-sm">
          Quick answers to common questions about onboarding, billing, and
          account setup.
        </p>
      </div>

      {faqSections.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {faqSections.map((section) => (
            <Card
              key={section.id}
              className="overflow-hidden border-border/70 bg-linear-to-b from-card to-muted/20 shadow-sm"
            >
              <CardHeader className="border-b bg-muted/30 !pb-2">
                <CardTitle className="flex items-center justify-between gap-3 text-base">
                  <span>{section.category}</span>
                  <span className="text-muted-foreground rounded-full border bg-background px-2 py-0.5 text-xs font-medium">
                    {section.questions.length} Q
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 py-2">
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={`${section.id}-${faq.id}`}
                      className="mt-2 rounded-lg border bg-background px-4 first:mt-0"
                    >
                      <AccordionTrigger className="text-left text-sm font-medium leading-snug hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
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
