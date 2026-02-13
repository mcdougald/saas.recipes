import { ColumnPricing } from "@/features/pricing/column-pricing";
import { pricingPageCopy } from "@/features/pricing/pricing-data";

export default function PricingPage() {
  return (
    <section className="space-y-8">
      <ColumnPricing />
      <div className="border-border bg-muted/30 mx-4 rounded-lg border p-4 text-sm lg:mx-6">
        <p className="font-medium">Why this pricing model exists</p>
        <p className="text-muted-foreground mt-2">{pricingPageCopy.supportNote}</p>
      </div>
    </section>
  );
}
