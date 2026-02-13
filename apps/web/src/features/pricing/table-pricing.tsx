import { Button } from "@/components/ui/button";
import {
  pricingComparisonRows,
  pricingPageCopy,
  pricingPlans,
} from "@/features/pricing/pricing-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

function FeatureValue({ value }: { value: string | boolean | undefined }) {
  if (typeof value === "undefined") {
    return <span className="text-muted-foreground">-</span>;
  }

  if (typeof value === "boolean") {
    return value ? (
      <Check className="text-primary mx-auto h-5 w-5" />
    ) : (
      <X className="text-muted-foreground mx-auto h-5 w-5" />
    );
  }
  return <span>{value}</span>;
}

export function TablePricing() {
  return (
    <div className="px-4 py-4 lg:px-6">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Compare Support Plans</h1>
        <p className="text-muted-foreground text-lg">
          {pricingPageCopy.description}
        </p>
      </div>

      <div className="mx-auto max-w-5xl overflow-x-auto rounded-lg border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Features</TableHead>
              {pricingPlans.map((plan) => (
                <TableHead key={plan.id} className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    {plan.popular && (
                      <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                        Most Popular
                      </span>
                    )}
                    <span className="text-lg font-semibold">{plan.name}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Price</TableCell>
              {pricingPlans.map((plan) => (
                <TableCell key={plan.id} className="text-center">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </TableCell>
              ))}
            </TableRow>

            {pricingComparisonRows.map((feature) => (
              <TableRow key={feature.name}>
                <TableCell className="font-medium">{feature.name}</TableCell>
                {pricingPlans.map((plan) => (
                  <TableCell key={plan.id} className="text-center">
                    <FeatureValue value={feature.values[plan.id]} />
                  </TableCell>
                ))}
              </TableRow>
            ))}

            <TableRow>
              <TableCell></TableCell>
              {pricingPlans.map((plan) => (
                <TableCell key={plan.id} className="text-center">
                  <Button
                    variant={plan.variant}
                    className="w-full max-w-[150px]"
                  >
                    {plan.buttonText}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
