"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

interface LearnPageAnalyticsProps {
  pageType: "overview" | "topic" | "courses" | "lesson" | "guide" | "snippets";
  slug?: string;
  courseSlug?: string;
}

const LAST_LEARN_VISIT_STORAGE_KEY = "learn:last-visit-at";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Track learn page views and returning learner patterns.
 *
 * @param props - Structured payload used for PostHog learn analytics events.
 * @returns Null because this component only emits side effects.
 */
export function LearnPageAnalytics({
  pageType,
  slug,
  courseSlug,
}: LearnPageAnalyticsProps) {
  useEffect(() => {
    posthog.capture("learn_page_viewed", {
      page_type: pageType,
      slug: slug ?? null,
      course_slug: courseSlug ?? null,
    });
  }, [courseSlug, pageType, slug]);

  useEffect(() => {
    try {
      const now = Date.now();
      const lastVisitValue = window.localStorage.getItem(
        LAST_LEARN_VISIT_STORAGE_KEY,
      );
      const lastVisitAt = lastVisitValue
        ? Number.parseInt(lastVisitValue, 10)
        : 0;

      if (
        Number.isFinite(lastVisitAt) &&
        lastVisitAt > 0 &&
        now - lastVisitAt <= 7 * DAY_IN_MS
      ) {
        posthog.capture("learn_returned_within_7d", {
          page_type: pageType,
          slug: slug ?? null,
        });
      }

      window.localStorage.setItem(LAST_LEARN_VISIT_STORAGE_KEY, String(now));
    } catch {
      // Ignore storage errors in private browsing modes.
    }
  }, [pageType, slug]);

  return null;
}
