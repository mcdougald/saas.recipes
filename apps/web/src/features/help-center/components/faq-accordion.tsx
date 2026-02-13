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
      <h2 className="text-2xl font-bold tracking-tight">
        Frequently Asked Questions
      </h2>

      {faqSections.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {faqSections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="text-lg">{section.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq) => (
                    <AccordionItem key={faq.id} value={`${section.id}-${faq.id}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm">
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
