import { courses } from "../src/features/learn/data/courses";
import { guides } from "../src/features/learn/data/guides";
import { lessons } from "../src/features/learn/data/lessons";
import { snippets } from "../src/features/learn/data/snippets";

interface ValidationError {
  scope: string;
  slug: string;
  message: string;
}

function collectDuplicateSlugErrors(
  scope: string,
  slugs: string[],
): ValidationError[] {
  const slugCounts = new Map<string, number>();
  for (const slug of slugs) {
    slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
  }

  return Array.from(slugCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([slug]) => ({
      scope,
      slug,
      message: "Duplicate slug.",
    }));
}

function validateRequiredText(
  scope: string,
  slug: string,
  label: string,
  value: string,
): ValidationError[] {
  if (value.trim().length > 0) {
    return [];
  }

  return [
    {
      scope,
      slug,
      message: `Missing required field: ${label}.`,
    },
  ];
}

function validateLearnContent(): ValidationError[] {
  const errors: ValidationError[] = [];

  errors.push(
    ...collectDuplicateSlugErrors(
      "courses",
      courses.map((course) => course.slug),
    ),
  );
  errors.push(
    ...collectDuplicateSlugErrors(
      "guides",
      guides.map((guide) => guide.slug),
    ),
  );
  errors.push(
    ...collectDuplicateSlugErrors(
      "lessons",
      lessons.map((lesson) => lesson.slug),
    ),
  );
  errors.push(
    ...collectDuplicateSlugErrors(
      "snippets",
      snippets.map((snippet) => snippet.slug),
    ),
  );

  for (const course of courses) {
    errors.push(
      ...validateRequiredText("courses", course.slug, "title", course.title),
    );
    errors.push(
      ...validateRequiredText(
        "courses",
        course.slug,
        "summary",
        course.summary,
      ),
    );
    if (course.learningOutcomes.length === 0) {
      errors.push({
        scope: "courses",
        slug: course.slug,
        message: "Must include at least one learning outcome.",
      });
    }
  }

  for (const lesson of lessons) {
    errors.push(
      ...validateRequiredText("lessons", lesson.slug, "title", lesson.title),
    );
    errors.push(
      ...validateRequiredText(
        "lessons",
        lesson.slug,
        "objective",
        lesson.objective,
      ),
    );
    if (lesson.exercisePrompts.length === 0) {
      errors.push({
        scope: "lessons",
        slug: lesson.slug,
        message: "Must include at least one exercise prompt.",
      });
    }
  }

  for (const guide of guides) {
    errors.push(
      ...validateRequiredText("guides", guide.slug, "title", guide.title),
    );
    errors.push(
      ...validateRequiredText("guides", guide.slug, "problem", guide.problem),
    );
    errors.push(
      ...validateRequiredText("guides", guide.slug, "outcome", guide.outcome),
    );
    if (guide.implementationSteps.length === 0) {
      errors.push({
        scope: "guides",
        slug: guide.slug,
        message: "Must include at least one implementation step.",
      });
    }
  }

  for (const snippet of snippets) {
    errors.push(
      ...validateRequiredText("snippets", snippet.slug, "title", snippet.title),
    );
    errors.push(
      ...validateRequiredText("snippets", snippet.slug, "focus", snippet.focus),
    );
    errors.push(
      ...validateRequiredText("snippets", snippet.slug, "code", snippet.code),
    );
    if (snippet.tags.length === 0) {
      errors.push({
        scope: "snippets",
        slug: snippet.slug,
        message: "Must include at least one tag.",
      });
    }
  }

  return errors;
}

const validationErrors = validateLearnContent();
if (validationErrors.length > 0) {
  console.error("Learn content lint failed.");
  for (const error of validationErrors) {
    console.error(`- [${error.scope}] ${error.slug}: ${error.message}`);
  }
  process.exitCode = 1;
} else {
  console.log("Learn content lint passed.");
}
