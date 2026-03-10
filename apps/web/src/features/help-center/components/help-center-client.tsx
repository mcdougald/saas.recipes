"use client";

import {
  ArrowUpRight,
  BookOpenText,
  CreditCard,
  LifeBuoy,
  type LucideIcon,
  MessageCircleQuestion,
  Rocket,
  Sparkles,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryCards } from "@/features/help-center/components/category-cards";
import { FAQAccordion } from "@/features/help-center/components/faq-accordion";
import { HelpSearchHero } from "@/features/help-center/components/help-search-hero";
import { PopularArticles } from "@/features/help-center/components/popular-articles";
import {
  HELP_CENTER_CATEGORIES,
  HELP_CENTER_FAQ_SECTIONS,
  HELP_CENTER_POPULAR_ARTICLES,
  HELP_CENTER_SUGGESTED_TOPICS,
} from "@/features/help-center/help-center-data";

type HelpCenterSection = "categories" | "articles" | "faq";

const HELP_CENTER_SECTION_PARAM = "section";
const HELP_CENTER_QUERY_PARAM = "q";
const HELP_CENTER_FAQ_PARAM = "faq";
const HELP_CENTER_SECTIONS: readonly HelpCenterSection[] = [
  "categories",
  "articles",
  "faq",
];
const HELP_CENTER_SECTION_ELEMENT_IDS: Record<HelpCenterSection, string> = {
  categories: "categories",
  articles: "articles",
  faq: "faq",
};
const HELP_CENTER_FAQ_ITEM_VALUES = {
  similarProjects: "getting-started-similar-projects-landscape",
  plansIncluded: "getting-started-included-in-each-plan",
  billingUpgradeDowngrade: "billing-payments-upgrade-downgrade-workflow",
} as const;

/**
 * Predefined quick-link CTA metadata for the help center.
 */
interface HelpCenterQuickLink {
  id: string;
  label: string;
  description: string;
  section: HelpCenterSection;
  query: string;
  icon: LucideIcon;
  faqItemValue?: string;
}

const HELP_CENTER_QUICK_LINKS: readonly HelpCenterQuickLink[] = [
  {
    id: "quick-start-recipes",
    label: "Getting started recipes",
    description: "Find onboarding and first-build playbooks fast.",
    section: "categories",
    query: "Getting started",
    icon: Sparkles,
  },
  {
    id: "plan-breakdown-faq",
    label: "Plan comparison FAQ",
    description: "Open what's included in each plan.",
    section: "faq",
    query: "included in each plan",
    icon: MessageCircleQuestion,
    faqItemValue: HELP_CENTER_FAQ_ITEM_VALUES.plansIncluded,
  },
  {
    id: "billing-workflows",
    label: "Billing upgrade workflows",
    description: "Review upgrade and downgrade behavior.",
    section: "faq",
    query: "upgrade or downgrade",
    icon: CreditCard,
    faqItemValue: HELP_CENTER_FAQ_ITEM_VALUES.billingUpgradeDowngrade,
  },
  {
    id: "similar-projects-landscape",
    label: "Similar projects landscape",
    description: "Jump to the merged Getting Started FAQ entry.",
    section: "faq",
    query: "similar projects",
    icon: Rocket,
    faqItemValue: HELP_CENTER_FAQ_ITEM_VALUES.similarProjects,
  },
];

/**
 * Returns true when a section value is valid for routing.
 */
function isHelpCenterSection(value: string | null): value is HelpCenterSection {
  return (
    value !== null && HELP_CENTER_SECTIONS.includes(value as HelpCenterSection)
  );
}

/**
 * Returns true when `query` matches `value` using normalized case-insensitive text matching.
 */
function isMatch(query: string, value: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

/**
 * Client-side help center orchestrator.
 *
 * Owns the search query state and computes filtered sections for cards, articles,
 * and FAQ content so all components stay in sync.
 */
export function HelpCenterClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get(HELP_CENTER_SECTION_PARAM);
  const selectedSection: HelpCenterSection = isHelpCenterSection(sectionFromUrl)
    ? sectionFromUrl
    : "categories";
  const faqItemFromUrl = searchParams.get(HELP_CENTER_FAQ_PARAM);
  const initialQueryFromUrl = searchParams.get(HELP_CENTER_QUERY_PARAM) ?? "";
  const [searchQuery, setSearchQuery] = useState(initialQueryFromUrl);
  const deferredQuery = useDeferredValue(searchQuery.trim());

  /**
   * Persist current help-center state in the URL for deep-linking.
   */
  const syncUrlState = useCallback(
    ({
      section,
      query,
      faq,
    }: {
      section?: HelpCenterSection;
      query?: string;
      faq?: string | null;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextSection = section ?? selectedSection;
      const nextQuery = query ?? searchQuery.trim();

      params.set(HELP_CENTER_SECTION_PARAM, nextSection);

      if (nextQuery.length > 0) {
        params.set(HELP_CENTER_QUERY_PARAM, nextQuery);
      } else {
        params.delete(HELP_CENTER_QUERY_PARAM);
      }

      if (faq && faq.length > 0) {
        params.set(HELP_CENTER_FAQ_PARAM, faq);
      } else {
        params.delete(HELP_CENTER_FAQ_PARAM);
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams, searchQuery, selectedSection],
  );

  useEffect(() => {
    setSearchQuery(searchParams.get(HELP_CENTER_QUERY_PARAM) ?? "");
  }, [searchParams]);

  useEffect(() => {
    const sectionElementId = HELP_CENTER_SECTION_ELEMENT_IDS[selectedSection];
    const sectionElement = document.getElementById(sectionElementId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSection]);

  const filteredCategories = useMemo(() => {
    if (!deferredQuery) {
      return HELP_CENTER_CATEGORIES;
    }

    const matchingArticleCategories = new Set(
      HELP_CENTER_POPULAR_ARTICLES.filter(
        (article) =>
          isMatch(deferredQuery, article.title) ||
          isMatch(deferredQuery, article.description) ||
          isMatch(deferredQuery, article.category),
      ).map((article) => article.category),
    );

    return HELP_CENTER_CATEGORIES.filter(
      (category) =>
        isMatch(deferredQuery, category.title) ||
        isMatch(deferredQuery, category.description) ||
        matchingArticleCategories.has(category.title),
    );
  }, [deferredQuery]);

  const filteredArticles = useMemo(() => {
    if (!deferredQuery) {
      return HELP_CENTER_POPULAR_ARTICLES;
    }

    return HELP_CENTER_POPULAR_ARTICLES.filter(
      (article) =>
        isMatch(deferredQuery, article.title) ||
        isMatch(deferredQuery, article.description) ||
        isMatch(deferredQuery, article.category),
    );
  }, [deferredQuery]);

  const filteredFaqSections = useMemo(() => {
    if (!deferredQuery) {
      return HELP_CENTER_FAQ_SECTIONS;
    }

    return HELP_CENTER_FAQ_SECTIONS.map((section) => {
      const filteredQuestions = section.questions.filter(
        (faq) =>
          isMatch(deferredQuery, section.category) ||
          isMatch(deferredQuery, faq.question) ||
          isMatch(deferredQuery, faq.answer),
      );

      return {
        ...section,
        questions: filteredQuestions,
      };
    }).filter((section) => section.questions.length > 0);
  }, [deferredQuery]);

  const totalMatches = useMemo(() => {
    if (!deferredQuery) {
      return (
        HELP_CENTER_CATEGORIES.length +
        HELP_CENTER_POPULAR_ARTICLES.length +
        HELP_CENTER_FAQ_SECTIONS.reduce(
          (count, section) => count + section.questions.length,
          0,
        )
      );
    }

    return (
      filteredCategories.length +
      filteredArticles.length +
      filteredFaqSections.reduce(
        (count, section) => count + section.questions.length,
        0,
      )
    );
  }, [
    deferredQuery,
    filteredArticles,
    filteredCategories,
    filteredFaqSections,
  ]);

  const activeFaqItem = useMemo(() => {
    if (!faqItemFromUrl) {
      return null;
    }

    const hasFaqItem = HELP_CENTER_FAQ_SECTIONS.some((section) =>
      section.questions.some(
        (faq) => `${section.id}-${faq.id}` === faqItemFromUrl,
      ),
    );

    return hasFaqItem ? faqItemFromUrl : null;
  }, [faqItemFromUrl]);

  function handleSearchSubmit(nextQuery: string) {
    const trimmedQuery = nextQuery.trim();
    setSearchQuery(trimmedQuery);
    syncUrlState({ query: trimmedQuery });
  }

  function handleSelectSection(section: HelpCenterSection) {
    syncUrlState({
      section,
      faq: section === "faq" ? activeFaqItem : null,
    });
  }

  function handleCategorySelect(categoryTitle: string) {
    setSearchQuery(categoryTitle);
    syncUrlState({
      section: "categories",
      query: categoryTitle,
      faq: null,
    });
  }

  function handleQuickLink({
    query,
    section,
    faqItemValue,
  }: {
    query: string;
    section: HelpCenterSection;
    faqItemValue?: string;
  }) {
    setSearchQuery(query);
    syncUrlState({
      section,
      query,
      faq: section === "faq" ? (faqItemValue ?? activeFaqItem) : null,
    });
  }

  function handleFaqItemChange(value: string | null) {
    syncUrlState({
      section: "faq",
      faq: value,
    });
  }

  const faqEntryCount = useMemo(
    () =>
      filteredFaqSections.reduce(
        (count, section) => count + section.questions.length,
        0,
      ),
    [filteredFaqSections],
  );

  return (
    <div className="space-y-8 lg:space-y-10">
      <HelpSearchHero
        searchQuery={searchQuery}
        resultCount={totalMatches}
        suggestedTopics={HELP_CENTER_SUGGESTED_TOPICS}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="relative overflow-hidden border-border/70 bg-linear-to-br from-primary/20 via-background to-primary/5 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-primary/10 to-transparent" />
          <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-primary/10 blur-2xl" />
          <CardContent className="relative space-y-6 p-6">
            <Badge className="h-6 rounded-full bg-primary/10 px-3 text-primary hover:bg-primary/10">
              Build with confidence
            </Badge>
            <div className="space-y-2">
              <h3 className="max-w-3xl text-2xl font-semibold tracking-tight lg:text-[1.7rem]">
                Turn open-source patterns into production-ready SaaS decisions
              </h3>
              <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
                Discover proven implementation paths, compare architecture
                choices, and jump from discovery to execution without losing
                momentum.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-md border border-border/70 bg-background/85 p-3 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <BookOpenText className="size-4" />
                  </span>
                  <p className="text-xl font-semibold">
                    {filteredCategories.length}
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium">Focused categories</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Navigate the exact area you are implementing next.
                </p>
              </article>
              <article className="rounded-md border border-border/70 bg-background/85 p-3 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <LifeBuoy className="size-4" />
                  </span>
                  <p className="text-xl font-semibold">
                    {filteredArticles.length}
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium">Popular walkthroughs</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Learn from what other builders use most.
                </p>
              </article>
              <article className="rounded-md border border-border/70 bg-background/85 p-3 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <MessageCircleQuestion className="size-4" />
                  </span>
                  <p className="text-xl font-semibold">{faqEntryCount}</p>
                </div>
                <p className="mt-2 text-sm font-medium">
                  Actionable FAQ answers
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Get direct answers with implementation context.
                </p>
              </article>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickLink({
                    query: "Getting started",
                    section: "categories",
                  })
                }
                className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
              >
                Start with onboarding
                <ArrowUpRight className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickLink({
                    query: "included in each plan",
                    section: "faq",
                    faqItemValue: HELP_CENTER_FAQ_ITEM_VALUES.plansIncluded,
                  })
                }
                className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/80 px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
              >
                Compare plans quickly
                <ArrowUpRight className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickLink({
                    query: "similar projects",
                    section: "faq",
                    faqItemValue: HELP_CENTER_FAQ_ITEM_VALUES.similarProjects,
                  })
                }
                className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/80 px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
              >
                View similar-project landscape
                <ArrowUpRight className="size-3.5" />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/70 bg-linear-to-b from-card via-card to-muted/30 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-primary/10 to-transparent" />
          <CardHeader className="relative pb-2">
            <CardTitle className="text-base">Quick links</CardTitle>
            <p className="text-muted-foreground text-xs">
              Shortcuts synced to the latest FAQ structure.
            </p>
          </CardHeader>
          <CardContent className="relative space-y-3 pt-0 text-sm">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectSection("categories")}
                className={`inline-flex items-center justify-center gap-1 rounded-md border px-2 py-2 text-[11px] font-medium transition-colors ${
                  selectedSection === "categories"
                    ? "border-primary/35 bg-primary/10 text-primary"
                    : "border-border/60 bg-background/90 hover:bg-muted/80"
                }`}
              >
                <BookOpenText className="size-3.5" />
                Categories
              </button>
              <button
                type="button"
                onClick={() => handleSelectSection("articles")}
                className={`inline-flex items-center justify-center gap-1 rounded-md border px-2 py-2 text-[11px] font-medium transition-colors ${
                  selectedSection === "articles"
                    ? "border-primary/35 bg-primary/10 text-primary"
                    : "border-border/60 bg-background/90 hover:bg-muted/80"
                }`}
              >
                <LifeBuoy className="size-3.5" />
                Articles
              </button>
              <button
                type="button"
                onClick={() => handleSelectSection("faq")}
                className={`inline-flex items-center justify-center gap-1 rounded-md border px-2 py-2 text-[11px] font-medium transition-colors ${
                  selectedSection === "faq"
                    ? "border-primary/35 bg-primary/10 text-primary"
                    : "border-border/60 bg-background/90 hover:bg-muted/80"
                }`}
              >
                <MessageCircleQuestion className="size-3.5" />
                FAQ
              </button>
            </div>
            <div className="border-border/60 border-t pt-2">
              {HELP_CENTER_QUICK_LINKS.map((link) => {
                const LinkIcon = link.icon;
                const isLinkActive =
                  selectedSection === link.section &&
                  (link.faqItemValue
                    ? activeFaqItem === link.faqItemValue
                    : true);

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() =>
                      handleQuickLink({
                        query: link.query,
                        section: link.section,
                        faqItemValue: link.faqItemValue,
                      })
                    }
                    className={`mb-1.5 flex w-full items-start gap-2 rounded-md border px-2.5 py-2 text-left transition-colors last:mb-0 ${
                      isLinkActive
                        ? "border-primary/35 bg-primary/10"
                        : "border-border/60 bg-background/90 hover:bg-muted/80"
                    }`}
                  >
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/70">
                      <LinkIcon className="text-muted-foreground size-3.5" />
                    </span>
                    <span className="flex-1 space-y-0.5">
                      <span className="block text-xs font-medium">
                        {link.label}
                      </span>
                      <span className="text-muted-foreground block text-[11px] leading-snug">
                        {link.description}
                      </span>
                    </span>
                    <ArrowUpRight className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <section id="categories" className="space-y-8">
        <CategoryCards
          categories={filteredCategories}
          searchQuery={deferredQuery}
          onSelectCategory={handleCategorySelect}
        />

        <div id="articles">
          <PopularArticles
            articles={filteredArticles}
            searchQuery={deferredQuery}
          />
        </div>
      </section>

      <FAQAccordion
        faqSections={filteredFaqSections}
        searchQuery={deferredQuery}
        activeItemValue={activeFaqItem}
        onActiveItemChange={handleFaqItemChange}
      />
    </div>
  );
}
