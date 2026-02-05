import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    buttonText: "Get started free",
    variant: "outline" as const,
  },
  {
    name: "Basic",
    price: "$9",
    period: "/month",
    buttonText: "Choose Basic",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    buttonText: "Choose Pro",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    buttonText: "Choose Enterprise",
    variant: "outline" as const,
  },
];

const features = [
  {
    name: "Access",
    free: "Limited / temporary",
    basic: "Full access",
    pro: "Full access",
    enterprise: "Full access",
  },
  {
    name: "Notes & repository recipes",
    free: false,
    basic: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "All live projects",
    free: false,
    basic: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "AI Chef",
    free: false,
    basic: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "My Help (my time)",
    free: false,
    basic: false,
    pro: true,
    enterprise: "Priority",
  },
  {
    name: "Team workspace & sharing",
    free: false,
    basic: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "Support",
    free: "Community",
    basic: "Community",
    pro: "My Help",
    enterprise: "Priority My Help",
  },
];

function FeatureValue({ value }: { value: string | boolean }) {
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
        <h1 className="mb-4 text-4xl font-bold">Compare Plans</h1>
        <p className="text-muted-foreground text-lg">
          Find the perfect plan for your needs
        </p>
      </div>

      <div className="mx-auto max-w-5xl overflow-x-auto rounded-lg border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Features</TableHead>
              {plans.map((plan) => (
                <TableHead key={plan.name} className="text-center">
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
              {plans.map((plan) => (
                <TableCell key={plan.name} className="text-center">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </TableCell>
              ))}
            </TableRow>

            {features.map((feature) => (
              <TableRow key={feature.name}>
                <TableCell className="font-medium">{feature.name}</TableCell>
                <TableCell className="text-center">
                  <FeatureValue value={feature.free} />
                </TableCell>
                <TableCell className="text-center">
                  <FeatureValue value={feature.basic} />
                </TableCell>
                <TableCell className="text-center">
                  <FeatureValue value={feature.pro} />
                </TableCell>
                <TableCell className="text-center">
                  <FeatureValue value={feature.enterprise} />
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell></TableCell>
              {plans.map((plan) => (
                <TableCell key={plan.name} className="text-center">
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
