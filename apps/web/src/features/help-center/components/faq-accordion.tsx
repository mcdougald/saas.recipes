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
          "Click the 'Sign Up' button in the top right corner and provide your email and a password. After verifying your email, you can explore recipes and content according to your plan.",
      },
      {
        question: "What's included in each plan?",
        answer:
          "Free gives you limited, temporary access to browse recipes and view demos. Basic includes full access to notes, repository recipes, and all live projects. Pro adds the AI Chef plus My Help (direct access to my time). Enterprise is for teams: everything in Pro plus team workspace, sharing, and priority support.",
      },
      {
        question: "How do I get started?",
        answer:
          "Sign up for a free account to explore. Use the dashboard to browse recipes and live project demos. Upgrade to Basic for full access, or to Pro for AI Chef and My Help when you're ready.",
      },
    ],
  },
  {
    category: "Account & Settings",
    questions: [
      {
        question: "How do I change my password?",
        answer:
          "Go to Settings > Security > Change Password. Enter your current password and your new password twice. Make sure your new password is at least 8 characters long and includes a mix of letters, numbers, and special characters.",
      },
      {
        question: "Can I change my email address?",
        answer:
          "Yes, you can change your email address in Settings > Account > Email. You'll need to verify your new email address before it becomes active. Make sure to check your spam folder for the verification email.",
      },
      {
        question: "How do I enable two-factor authentication?",
        answer:
          "Navigate to Settings > Security > Two-Factor Authentication and click 'Enable'. You'll need to scan a QR code with an authenticator app like Google Authenticator or Authy. Keep your backup codes in a safe place.",
      },
    ],
  },
  {
    category: "Billing & Payments",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely through our payment partners.",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "Yes, you can cancel your subscription at any time from Settings > Billing. Your subscription will remain active until the end of your current billing period, and you'll continue to have access to all features until then.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee for new subscriptions. If you're not satisfied with our service within the first 30 days, contact our support team for a full refund. Refunds for annual plans are prorated based on unused time.",
      },
    ],
  },
];

export function FAQAccordion() {
  return (
    <div className="space-y-6">
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
