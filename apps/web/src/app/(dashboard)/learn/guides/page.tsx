import { type Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LearnPageAnalytics } from "@/features/learn/components/learn-page-analytics";
import { listPublishedGuides } from "@/features/learn/data/guides";

export const metadata: Metadata = {
  title: "Guides | Learn",
  description:
    "Follow practical implementation guides tied to real SaaS outcomes.",
  alternates: {
    canonical: "/learn/guides",
  },
};

/**
 * Render the guides index route for discoverability.
 */
export default function LearnGuidesPage() {
  const publishedGuides = listPublishedGuides();

  return (
    <>
      <LearnPageAnalytics pageType="guide" />
      <div className="@container/main space-y-6 px-4 pb-6 lg:px-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Guides</CardTitle>
            <CardDescription>
              Outcome-driven implementation walkthroughs linked to snippets and
              courses.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {publishedGuides.map((guide) => (
            <Card key={guide.slug} className="border">
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {guide.estimatedReadMinutes} min
                  </Badge>
                  <Badge variant="outline">{guide.status}</Badge>
                </div>
                <CardTitle>{guide.title}</CardTitle>
                <CardDescription>{guide.problem}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{guide.outcome}</p>
                <Button asChild variant="outline">
                  <Link href={`/learn/guides/${guide.slug}`}>Open guide</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
