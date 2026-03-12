import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { RepositoryDetail } from "@/features/repos/components/repository-detail";
import {
  getRelatedRepositoriesBySlug,
  getRepositoryBySlug,
  getRepositorySlugs,
} from "@/features/repos/data/repository-dashboard-data";

/**
 * Dynamic route params for one repository recipe page.
 */
type DashboardRepositoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Generate all known repository slugs for static route pre-rendering.
 *
 * @returns Dashboard repository route params.
 */
export function generateStaticParams() {
  return getRepositorySlugs().map((slug) => ({ slug }));
}

/**
 * Build metadata for one repository recipe detail page.
 *
 * @param props - Route params containing the repository slug.
 * @returns Metadata with repository-specific title and description.
 */
export async function generateMetadata({
  params,
}: DashboardRepositoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getRepositoryBySlug(slug);

  if (!project) {
    return {
      title: "Recipe | Dashboard",
    };
  }

  return {
    title: `${project.repo.owner}/${project.repo.name} | Recipe`,
    description: project.description,
  };
}

/**
 * Render the repository recipe detail page.
 *
 * @param props - Route params containing the repository slug.
 * @returns Detail page for a single tracked repository recipe.
 */
export default async function DashboardRepositoryPage({
  params,
}: DashboardRepositoryPageProps) {
  const { slug } = await params;
  const project = getRepositoryBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedRepositoriesBySlug(slug, 5);

  return (
    <RepositoryDetail project={project} relatedProjects={relatedProjects} />
  );
}
