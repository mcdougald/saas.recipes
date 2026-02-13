"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CategoryCards } from "@/features/help-center/components/category-cards";
import { FAQAccordion } from "@/features/help-center/components/faq-accordion";
import {
  HELP_CENTER_CATEGORIES,
  HELP_CENTER_FAQ_SECTIONS,
  HELP_CENTER_POPULAR_ARTICLES,
  HELP_CENTER_SUGGESTED_TOPICS,
} from "@/features/help-center/help-center-data";
import { HelpSearchHero } from "@/features/help-center/components/help-search-hero";
import { PopularArticles } from "@/features/help-center/components/popular-articles";

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
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery.trim());

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
  }, [deferredQuery, filteredArticles, filteredCategories, filteredFaqSections]);

  return (
    <>
      <HelpSearchHero
        searchQuery={searchQuery}
        resultCount={totalMatches}
        suggestedTopics={HELP_CENTER_SUGGESTED_TOPICS}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={setSearchQuery}
      />

      <CategoryCards
        categories={filteredCategories}
        searchQuery={deferredQuery}
        onSelectCategory={setSearchQuery}
      />

      <PopularArticles articles={filteredArticles} searchQuery={deferredQuery} />

      <FAQAccordion faqSections={filteredFaqSections} searchQuery={deferredQuery} />
    </>
  );
}
