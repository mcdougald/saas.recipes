"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqSections = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Click Sign up in the header and enter your email and a password. After verifying your email, you can explore saas.recipes and browse recipes and demos according to your plan.",
      },
      {
        question: "What's included in each plan?",
        answer:
          "Free gives limited access to browse recipes and view demos. Basic includes full access to notes, repository recipes, and all live projects. Pro adds the AI Chef and My Help. Enterprise is for teams: everything in Pro plus team workspace, sharing, and priority support.",
      },
      {
        question: "How do I get started?",
        answer:
          "Sign up for a free account, then use the dashboard to browse recipes and live project demos. Upgrade to Basic for full access to recipes and projects, or to Pro for the AI Chef and My Help when you're ready.",
      },
    ],
  },
  {
    category: "Recipes & Content",
    questions: [
      {
        question: "What are recipes?",
        answer:
          "Recipes are proven patterns and implementations from indie devs and teams—auth, billing, security, and more. You get codebase insights, real examples, and patterns that match how you work. Browse by category or use the dashboard to explore.",
      },
      {
        question: "Can I use recipe code in my own project?",
        answer:
          "Yes. Recipes are meant to be copied and adapted. Use what fits your stack, skip the wiring, and ship faster. Check each recipe for license and usage details.",
      },
    ],
  },
  {
    category: "Account & Settings",
    questions: [
      {
        question: "How do I change my password?",
        answer:
          "Go to Settings > Account (or Security). Enter your current password and your new password twice. Use at least 8 characters with a mix of letters, numbers, and symbols.",
      },
      {
        question: "Can I change my email address?",
        answer:
          "Yes. Update your email in Settings > Account. You'll need to verify the new address before it becomes active; check your spam folder for the verification email.",
      },
      {
        question: "How do I enable two-factor authentication?",
        answer:
          "Go to Settings > Account (or Security) and turn on Two-Factor Authentication. Scan the QR code with an authenticator app (e.g. Google Authenticator or Authy) and store your backup codes somewhere safe.",
      },
    ],
  },
  {
    category: "Billing & Payments",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept major credit cards (Visa, Mastercard, American Express), PayPal, and for annual plans, bank transfer. Payments are processed securely through our payment provider.",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "Yes. Cancel from Settings > Billing or the payment dashboard. Your subscription stays active until the end of the current billing period, and you keep access until then.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee for new subscriptions. Contact support within 30 days for a full refund. Annual plan refunds may be prorated for unused time.",
      },
    ],
  },
];

export function FAQAccordion() {
  return (
    <div id="faq" className="scroll-mt-6 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Frequently Asked Questions
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {faqSections.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <CardTitle className="text-lg">{section.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${section.category}-${index}`}
                  >
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
    </div>
  );
}
