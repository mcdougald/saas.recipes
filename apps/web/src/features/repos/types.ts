export type RepositoryStatus = "active" | "paused" | "archived";

export type RepositorySourceType = "template" | "reference" | "starter";

export type ISODateString = string;

export type RepositoryVisibility = "public" | "private" | "internal";

export type RepositoryMetadata = {
  size: number;
  forks: number;
  stars: number;
  language: string;
  watchers: number;
  openIssues: number;
  visibility: RepositoryVisibility;
  lastSyncedAt: ISODateString;
};

export type RepositoryPackageJson = {
  name?: string;
  version?: string;
  private?: boolean;
  type?: string;
  description?: string | null;
  homepage?: string | null;
  packageManager?: string | null;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  engines?: Record<string, string>;
  bugs?: Record<string, unknown> | string;
  repository?: Record<string, unknown> | string;
  overrides?: Record<string, string>;
  [key: string]: unknown;
};

export type RepositoryMarkdownFile = {
  path: string;
  size: number;
  filename: string;
  content: string;
};

export type RepositoryActor = {
  login: string;
  avatarUrl: string;
};

export type RepositoryDeploymentStatus = {
  id: number;
  state: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  description: string | null;
  environment: string | null;
  environmentUrl: string | null;
};

export type RepositoryDeployment = {
  id: number;
  ref: string;
  sha: string;
  task: string;
  creator: RepositoryActor;
  statuses: RepositoryDeploymentStatus[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  description: string | null;
  environment: string | null;
};

export type RepositoryDeployments = {
  totalCount: number;
  failureRate: number;
  successRate: number;
  environments: Array<{
    url: string | null;
    name: string;
    successRate: number;
    latestStatus: string;
    lastDeploymentAt: ISODateString | null;
    totalDeployments: number;
    firstDeploymentAt: ISODateString | null;
    deploymentsLast30Days: number;
    averageTimeBetweenDeploymentsHours: number | null;
  }>;
  statusCounts: Record<string, number>;
  activityByHour: Array<{
    hour: number;
    count: number;
  }>;
  lastDeploymentAt: ISODateString | null;
  firstDeploymentAt: ISODateString | null;
  recentDeployments: RepositoryDeployment[];
  deploymentsLast7Days: number;
  deploymentsLast30Days: number;
  deploymentsLast90Days: number;
  averageDeploymentsPerWeek: number;
  averageDeploymentsPerMonth: number;
  averageLeadTimeToSuccessMinutes: number | null;
  medianTimeBetweenDeploymentsHours: number | null;
  averageTimeBetweenDeploymentsHours: number | null;
};

export type RepositoryReleaseAsset = {
  id: number;
  name: string;
  size: number;
  contentType: string;
  downloadCount: number;
  browserDownloadUrl: string;
};

export type RepositoryRelease = {
  id: number;
  url: string;
  body: string | null;
  name: string | null;
  draft: boolean;
  assets: RepositoryReleaseAsset[];
  author: RepositoryActor;
  htmlUrl: string;
  tagName: string;
  createdAt: ISODateString;
  prerelease: boolean;
  publishedAt: ISODateString | null;
};

export type RepositoryReleases = {
  latestRelease: RepositoryRelease | null;
  latestVersion: string | null;
  totalReleases: number;
  recentReleases: RepositoryRelease[];
  latestReleaseAt: ISODateString | null;
};

export type RepositoryPullRequest = {
  id: number;
  url: string;
  body: string | null;
  draft: boolean;
  state: string;
  title: string;
  author: RepositoryActor;
  labels: Array<Record<string, unknown>>;
  merged: boolean;
  number: number;
  baseRef: string;
  commits: number;
  headRef: string;
  htmlUrl: string;
  closedAt: ISODateString | null;
  comments: number;
  mergedAt: ISODateString | null;
  additions: number | null;
  createdAt: ISODateString;
  deletions: number | null;
  updatedAt: ISODateString;
  changedFiles: number | null;
  reviewComments: number;
};

export type RepositoryPullRequestAnalytics = {
  maxAge?: number;
  lastPrAt?: ISODateString | null;
  openCount?: number;
  averageAge?: number;
  draftCount?: number;
  maxCommits?: number;
  totalCount?: number;
  authorCount?: number;
  closedCount?: number;
  maxComments?: number;
  mergedCount?: number;
  maxAdditions?: number;
  averageCommits?: number;
  averageComments?: number;
  maxChangedFiles?: number;
  averageAdditions?: number;
  recentPullRequests?: RepositoryPullRequest[];
  [key: string]: unknown;
};

export type RepositoryIssueAnalytics = {
  openCount?: number;
  closedCount?: number;
  totalCount?: number;
  staleOpenIssues?: number;
  lastIssueAt?: ISODateString | null;
  oldestOpenIssues?: Array<Record<string, unknown>>;
  topCommentedOpenIssues?: Array<Record<string, unknown>>;
  recentIssues?: Array<Record<string, unknown>>;
  byLabel?: Array<Record<string, unknown>>;
  byAssignee?: Array<Record<string, unknown>>;
  byAuthor?: Array<Record<string, unknown>>;
  activity?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

/**
 * Represent one contributor row extracted from repository analytics.
 */
export type RepositoryContributor = {
  id?: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  githubUsername?: string | null;
  commitCount?: number;
  additions?: number;
  deletions?: number;
  filesChanged?: number;
  activeMonths?: number;
  firstCommitAt?: ISODateString | null;
  lastCommitAt?: ISODateString | null;
  isBot?: boolean;
  isPrimaryContributor?: boolean;
  fileTypesChanged?: Array<Record<string, unknown>>;
  changedFileCounts?: Array<Record<string, unknown>>;
  commitTypes?: Array<Record<string, unknown>>;
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
};

/**
 * Represent one package dependency discovered in repository manifests.
 */
export type RepositoryDependency = {
  id?: string;
  packageName?: string;
  category?: string | null;
  version?: string | null;
  latestVersion?: string | null;
  license?: string | null;
  usageCount?: number;
  dependencyDepth?: number;
  fileCount?: number;
  usedInPackages?: string[] | null;
  isDirect?: boolean;
  isDevDependency?: boolean;
  isPeerDependency?: boolean;
  isCritical?: boolean;
  bundleSize?: number | null;
  addedAt?: ISODateString | null;
  lastUpdatedAt?: ISODateString | null;
  [key: string]: unknown;
};

/**
 * Group dependencies into platform- or category-level buckets.
 */
export type RepositoryDependencyGroup = {
  id?: string;
  groupName?: string;
  category?: string | null;
  dependencyCount?: number;
  dependencies?: RepositoryDependency[];
  config?: Record<string, unknown> | null;
  [key: string]: unknown;
};

/**
 * Capture dependency version changes over time.
 */
export type RepositoryDependencyChange = {
  id?: string;
  packageName?: string;
  fromVersion?: string | null;
  toVersion?: string | null;
  changedAt?: ISODateString | null;
  severity?: string | null;
  [key: string]: unknown;
};

/**
 * Represent one file-level churn hotspot in AI setup analytics.
 */
export type RepositoryAiSetupChurnFile = {
  path: string;
  changeCount: number;
  lastChangedAt: ISODateString | null;
  additionsTotal: number;
  deletionsTotal: number;
};

/**
 * Aggregate AI setup file churn metrics extracted from git history.
 */
export type RepositoryAiSetupChurnMetrics = {
  totalAdditions: number;
  totalDeletions: number;
  totalChangeCount: number;
  touchedFileCount: number;
  touchedCommitCount: number;
  analyzedCommitCount: number;
  topChangedFiles: RepositoryAiSetupChurnFile[];
};

/**
 * Represent one instruction or configuration file related to AI setup.
 */
export type RepositoryAiInstructionFile = {
  path: string;
  type: string;
};

/**
 * Represent one file-extension frequency bucket.
 */
export type RepositoryFileExtensionCount = {
  extension: string;
  count: number;
};

/**
 * Represent one AI instruction-type frequency bucket.
 */
export type RepositoryInstructionFileTypeCount = {
  type: string;
  count: number;
};

/**
 * Aggregate AI assistant setup metrics discovered in repository files.
 */
export type RepositoryAiSetupMetrics = {
  churn: RepositoryAiSetupChurnMetrics | null;
  detectedTools: string[];
  totalFileCount: number;
  instructionFiles: RepositoryAiInstructionFile[];
  toolingDirectories: string[];
  fileExtensionCounts: RepositoryFileExtensionCount[];
  instructionFileCount: number;
  totalConfigFileCount: number;
  toolingDirectoryCount: number;
  instructionFileTypeCounts: RepositoryInstructionFileTypeCount[];
};

/**
 * Represent one hotspot file ranked by change frequency.
 */
export type RepositoryHotspotFile = {
  path: string;
  changeCount: number;
  lastChangedAt: ISODateString | null;
  additionsTotal: number;
  deletionsTotal: number;
};

/**
 * Represent one large file discovered in repository snapshots.
 */
export type RepositoryLargestFile = {
  path: string;
  size: number;
  extension: string | null;
};

export type RepositoryCommit = {
  id: number;
  repo_id: string;
  sha: string;
  message: string;
  title: string | null;
  body: string | null;
  author_name: string | null;
  author_email: string | null;
  authored_date: ISODateString | null;
  committer_name: string | null;
  committer_email: string | null;
  committed_date: ISODateString | null;
  co_authors: string[] | null;
  conventional_type: string | null;
  conventional_scope: string | null;
  is_breaking_change: boolean;
  breaking_change_description: string | null;
  additions: number;
  deletions: number;
  files_changed: number;
  files_added: number | null;
  files_modified: number | null;
  files_deleted: number | null;
  files_renamed: number | null;
  file_changes: unknown[] | null;
  changed_paths: string[];
  parent_shas: string[];
  parent_count: number;
  is_merge: boolean;
  merged_branch: string | null;
  tags: string[] | null;
  refs: string[] | null;
  is_verified: boolean;
  verification_status: string | null;
  signer: string | null;
  pr_number: number | null;
  pr_title: string | null;
  affected_packages: string[] | null;
  file_types: string[];
  categories: string[];
  metadata: Record<string, unknown> | null;
  created_at: ISODateString;
  updated_at: ISODateString | null;
};

export type RepositoryRepo = {
  id: string;
  added_at: ISODateString;
  updated_at: ISODateString;
  archived: boolean;
  default_branch: string;
  description: string | null;
  homepage: string | null;
  name: string;
  owner: string;
  owner_id: number;
  stars: number;
  topics: string[];
  pushed_at: ISODateString;
  created_at: ISODateString;
  last_commit: string | null;
  commit_count: number;
  contributor_count: number;
  forks: number;
  openIssues: number;
  closedIssues: number;
  totalIssues: number;
  openPullRequests: number;
  closedPullRequests: number;
  mergedPullRequests: number;
  totalPullRequests: number;
  latestVersion: string | null;
  license: string | null;
  readme: string | null;
  packageJson: RepositoryPackageJson | null;
  markdownFiles: RepositoryMarkdownFile[];
  aiSetupMetrics: RepositoryAiSetupMetrics | null;
  deployments: RepositoryDeployments | null;
  releases: RepositoryReleases | null;
  pullRequests: RepositoryPullRequestAnalytics | null;
  issues: RepositoryIssueAnalytics | null;
  githubActions: Record<string, unknown> | null;
  workspacePackageJsons: RepositoryPackageJson[];
  engines: string[];
  packageManager: string | null;
  metadata: Record<string, unknown> | null;
  workspace: Record<string, unknown> | null;
  features: Record<string, unknown> | null;
  contributors: RepositoryContributor[];
  gitAnalysis: Record<string, unknown> | null;
  dependencies: RepositoryDependency[];
  dependencyGroups: RepositoryDependencyGroup[];
  dependencyChanges: RepositoryDependencyChange[];
  hotspotFiles: RepositoryHotspotFile[];
  largestFiles: RepositoryLargestFile[];
  commits: RepositoryCommit[];
  [key: string]: unknown;
};

/**
 * Represents a fully-hydrated project row used as the source for dashboard list projections.
 */
export type RepositoryDashboardItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  overrideDescription: boolean;
  overrideURL: boolean;
  status: RepositoryStatus;
  url: string;
  logo: string | null;
  twitter: string | null;
  priority: number;
  comments: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  repoId: string;
  license: string | null;
  sourceType: RepositorySourceType;
  inspirationScore: number;
  trends: RepositoryTrendSignals;
  metadata: RepositoryMetadata;
  repo: Pick<
    RepositoryRepo,
    | "owner"
    | "name"
    | "created_at"
    | "default_branch"
    | "pushed_at"
    | "stars"
    | "forks"
    | "commit_count"
    | "contributor_count"
    | "openIssues"
    | "closedIssues"
    | "totalIssues"
    | "openPullRequests"
    | "closedPullRequests"
    | "mergedPullRequests"
    | "totalPullRequests"
    | "latestVersion"
    | "topics"
  > &
    Partial<
      Pick<
        RepositoryRepo,
        | "deployments"
        | "releases"
        | "pullRequests"
        | "issues"
        | "contributors"
        | "packageManager"
        | "packageJson"
        | "markdownFiles"
        | "aiSetupMetrics"
        | "dependencies"
        | "dependencyGroups"
        | "dependencyChanges"
        | "hotspotFiles"
        | "largestFiles"
        | "workspacePackageJsons"
        | "commits"
        | "gitAnalysis"
      >
    > & {
      dependencyCount: number;
      workspacePackageCount: number;
      totalFilesTouched: number;
    };
};

/**
 * Captures recent repository momentum and codebase change direction.
 */
export type RepositoryTrendSignals = {
  commitsLast7Days: number;
  commitsLast30Days: number;
  additionsLast30Days: number;
  deletionsLast30Days: number;
  codeChurnLast30Days: number;
  deploymentsLast30Days: number | null;
  releasesLast90Days: number | null;
  topCategories: string[];
  topFileTypes: string[];
  commitMomentumRatio: number;
  mergeEfficiency30Days: number;
  deploymentFrequencyPerWeek: number | null;
  releaseFrequencyPerMonth: number | null;
  avgCommitSize30Days: number;
  stabilityScore: number;
  activityScore: number;
};

export type RepositoryDashboardListItem = Pick<
  RepositoryDashboardItem,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "status"
  | "url"
  | "license"
  | "sourceType"
  | "inspirationScore"
  | "trends"
  | "metadata"
  | "repo"
>;

/**
 * Defines aggregate metrics rendered in dashboard overview stat cards.
 */
export type RepositoryDashboardSummary = {
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  totalContributors: number;
  totalCommits: number;
  totalDependencies: number;
  totalWorkspacePackages: number;
  totalFilesTouched: number;
  totalRepoSizeKb: number;
  totalOpenIssues: number;
  totalOpenPullRequests: number;
  averageMergeRate: number;
  averageDeploymentSuccessRate: number | null;
  recentlyPushedLast30Days: number;
};
