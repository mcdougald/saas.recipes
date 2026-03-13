import { courses } from "../src/features/learn/data/courses";
import { guides } from "../src/features/learn/data/guides";
import { lessons } from "../src/features/learn/data/lessons";
import { snippets } from "../src/features/learn/data/snippets";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const STALE_THRESHOLD_DAYS = 90;

interface ReportItem {
  type: "course" | "guide" | "lesson" | "snippet";
  slug: string;
  status: string;
  lastUpdatedAt: string;
  daysSinceUpdate: number;
}

function parseDate(dateValue: string): number {
  const parsedValue = Date.parse(dateValue);
  if (Number.isNaN(parsedValue)) return 0;
  return parsedValue;
}

function toDaysSinceUpdate(dateValue: string): number {
  const parsedValue = parseDate(dateValue);
  if (!parsedValue) return Number.POSITIVE_INFINITY;
  return Math.floor((Date.now() - parsedValue) / DAY_IN_MS);
}

function collectStaleItems(): ReportItem[] {
  const reportItems: ReportItem[] = [];

  for (const course of courses) {
    reportItems.push({
      type: "course",
      slug: course.slug,
      status: course.status,
      lastUpdatedAt: course.lastUpdatedAt,
      daysSinceUpdate: toDaysSinceUpdate(course.lastUpdatedAt),
    });
  }
  for (const guide of guides) {
    reportItems.push({
      type: "guide",
      slug: guide.slug,
      status: guide.status,
      lastUpdatedAt: guide.lastUpdatedAt,
      daysSinceUpdate: toDaysSinceUpdate(guide.lastUpdatedAt),
    });
  }
  for (const lesson of lessons) {
    reportItems.push({
      type: "lesson",
      slug: lesson.slug,
      status: lesson.status,
      lastUpdatedAt: lesson.lastUpdatedAt,
      daysSinceUpdate: toDaysSinceUpdate(lesson.lastUpdatedAt),
    });
  }
  for (const snippet of snippets) {
    reportItems.push({
      type: "snippet",
      slug: snippet.slug,
      status: snippet.status,
      lastUpdatedAt: snippet.lastUpdatedAt,
      daysSinceUpdate: toDaysSinceUpdate(snippet.lastUpdatedAt),
    });
  }

  return reportItems
    .filter((item) => item.daysSinceUpdate >= STALE_THRESHOLD_DAYS)
    .toSorted(
      (first, second) => second.daysSinceUpdate - first.daysSinceUpdate,
    );
}

function printMonthlyRefreshReport() {
  const staleItems = collectStaleItems();

  console.log(`# Learn monthly content refresh report`);
  console.log(`Generated at: ${new Date().toISOString()}`);
  console.log(`Stale threshold: ${STALE_THRESHOLD_DAYS} days`);
  console.log("");

  if (staleItems.length === 0) {
    console.log("No stale learn content items found.");
    return;
  }

  console.log("## Stale content candidates");
  for (const staleItem of staleItems) {
    console.log(
      `- [${staleItem.type}] ${staleItem.slug} | status=${staleItem.status} | lastUpdatedAt=${staleItem.lastUpdatedAt} | daysSinceUpdate=${staleItem.daysSinceUpdate}`,
    );
  }

  console.log("");
  console.log("## Follow-up checklist");
  console.log("- Review low-completion and high-drop-off pages in analytics.");
  console.log("- Prioritize stale premium previews with high upgrade intent.");
  console.log(
    "- Refresh one course, one guide, and one snippet set per cycle.",
  );
}

printMonthlyRefreshReport();
