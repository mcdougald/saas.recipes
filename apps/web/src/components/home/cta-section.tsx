import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CtaSection() {
  return (
    <section
      className="border-t py-20 md:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="cta-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
          >
            Ready to cook?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Explore the product, try the patterns, and start shipping. No
            credit card required — just open the app and go.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Open dashboard
                <span className="ml-2" aria-hidden>→</span>
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base"
              >
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
