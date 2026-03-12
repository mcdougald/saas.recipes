import {
  type RepositoryAiSetupMetrics,
  type RepositoryDeployments,
  type RepositoryHotspotFile,
  type RepositoryLargestFile,
  type RepositoryReleases,
} from "@/features/repos/types";

type RawRepositoryRelease = {
  createdAt?: string | null;
  publishedAt?: string | null;
  tagName?: string | null;
  draft?: boolean | null;
  prerelease?: boolean | null;
  [key: string]: unknown;
};

type RawRepositoryReleases = {
  latestReleaseAt?: string | null;
  latestVersion?: string | null;
  totalReleases?: number | null;
  recentReleases?: RawRepositoryRelease[];
  [key: string]: unknown;
};

type RawRepositoryCommit = {
  additions?: number | null;
  deletions?: number | null;
  categories?: string[] | null;
  [key: string]: unknown;
};

type RawRepositoryMetadata = {
  size?: number;
  stars?: number;
  forks?: number;
  language?: string;
  watchers?: number;
  openIssues?: number;
  visibility?: string;
  lastSyncedAt?: string;
  [key: string]: unknown;
};

type RawRepositoryPullRequests = {
  mergedCount?: number | null;
  totalCount?: number | null;
  averageAge?: number | null;
  recentPullRequests?: Array<Record<string, unknown>>;
  activityByMonth?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

type RawRepositoryIssues = {
  openCount?: number | null;
  closedCount?: number | null;
  totalCount?: number | null;
  staleOpenIssues?: number | null;
  [key: string]: unknown;
};

type RawRepository = {
  owner?: string;
  name?: string;
  stars?: number;
  forks?: number;
  openIssues?: number;
  closedIssues?: number;
  totalIssues?: number;
  openPullRequests?: number;
  closedPullRequests?: number;
  mergedPullRequests?: number;
  totalPullRequests?: number;
  topics?: string[];
  packageManager?: string | null;
  packageJson?: Record<string, unknown> | null;
  deployments?: RepositoryDeployments | null;
  releases?: RepositoryReleases | null;
  aiSetupMetrics?: RepositoryAiSetupMetrics | null;
  pullRequests?: RawRepositoryPullRequests | null;
  issues?: RawRepositoryIssues | null;
  dependencies?: unknown[] | null;
  dependencyGroups?: unknown[] | null;
  dependencyChanges?: unknown[] | null;
  hotspotFiles?: RepositoryHotspotFile[] | null;
  largestFiles?: RepositoryLargestFile[] | null;
  contributors?: unknown[] | null;
  markdownFiles?: unknown[] | null;
  workspacePackageJsons?: unknown[] | null;
  commits?: RawRepositoryCommit[] | null;
  gitAnalysis?: Record<string, unknown> | null;
  [key: string]: unknown;
};

/**
 * Describe one raw project record from `project-mock-03-11-2026.json`.
 *
 * @remarks
 * Keep fields optional because the mock payload intentionally mixes complete
 * and partially-populated records.
 */
export type ProjectMockItem = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  status?: string;
  url?: string;
  logo?: string | null;
  twitter?: string | null;
  comments?: string | null;
  sourceType?: string;
  license?: string | null;
  inspirationScore?: number;
  priority?: number;
  repoId?: string;
  overrideDescription?: boolean;
  overrideURL?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metadata?: RawRepositoryMetadata;
  repo?: RawRepository;
  [key: string]: unknown;
};

/**
 * Describe the top-level project mock payload consumed by dashboard projections.
 */
export type ProjectMockPayload = {
  data?: ProjectMockItem[];
};
