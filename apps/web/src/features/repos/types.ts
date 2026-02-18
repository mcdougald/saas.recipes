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
  maxAge: number;
  lastPrAt: ISODateString | null;
  openCount: number;
  averageAge: number;
  draftCount: number;
  maxCommits: number;
  totalCount: number;
  authorCount: number;
  closedCount: number;
  maxComments: number;
  mergedCount: number;
  maxAdditions: number;
  averageCommits: number;
  averageComments: number;
  maxChangedFiles: number;
  averageAdditions: number;
  recentPullRequests: RepositoryPullRequest[];
  [key: string]: unknown;
};

export type RepositoryIssueAnalytics = {
  [key: string]: unknown;
};

export type RepositoryContributor = {
  [key: string]: unknown;
};

export type RepositoryDependency = {
  [key: string]: unknown;
};

export type RepositoryDependencyGroup = {
  [key: string]: unknown;
};

export type RepositoryDependencyChange = {
  [key: string]: unknown;
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
  commits: RepositoryCommit[];
  [key: string]: unknown;
};

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
  metadata: RepositoryMetadata;
  repo: RepositoryRepo;
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
  | "metadata"
  | "repo"
>;

export type RepositoryDashboardSummary = {
  totalStars: number;
  totalContributors: number;
  totalOpenIssues: number;
  totalOpenPullRequests: number;
};
