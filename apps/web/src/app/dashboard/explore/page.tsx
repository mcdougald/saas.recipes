import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  GitBranch, 
  Star, 
  GitFork, 
  Clock,
  Code2,
  BookOpen,
  ExternalLink
} from "lucide-react"

export default function ExplorePage() {
  const repositories = [
    {
      name: "next-shadcn-dashboard",
      description: "Modern admin dashboard built with Next.js 14, TypeScript, and shadcn/ui components",
      stars: 1234,
      forks: 156,
      language: "TypeScript",
      updated: "2 hours ago",
      topics: ["nextjs", "dashboard", "shadcn-ui", "admin"]
    },
    {
      name: "react-table-enterprise",
      description: "Production-ready data table with sorting, filtering, and pagination",
      stars: 892,
      forks: 103,
      language: "TypeScript",
      updated: "5 hours ago",
      topics: ["react", "table", "data-grid"]
    },
    {
      name: "saas-starter-kit",
      description: "Complete SaaS boilerplate with authentication, billing, and multi-tenancy",
      stars: 2156,
      forks: 298,
      language: "TypeScript",
      updated: "1 day ago",
      topics: ["saas", "starter", "nextjs", "stripe"]
    },
    {
      name: "ui-component-library",
      description: "Beautiful and accessible React components based on Radix UI",
      stars: 567,
      forks: 78,
      language: "TypeScript",
      updated: "3 days ago",
      topics: ["react", "components", "radix-ui"]
    },
    {
      name: "analytics-dashboard",
      description: "Real-time analytics dashboard with charts and visualizations",
      stars: 743,
      forks: 92,
      language: "TypeScript",
      updated: "1 week ago",
      topics: ["analytics", "dashboard", "charts"]
    },
  ]

  const categories = [
    { name: "Authentication", count: 23, icon: "🔐" },
    { name: "Databases", count: 18, icon: "🗄️" },
    { name: "UI Components", count: 45, icon: "🎨" },
    { name: "API Integration", count: 31, icon: "🔌" },
    { name: "Deployment", count: 15, icon: "🚀" },
    { name: "Testing", count: 12, icon: "✅" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Explore</h1>
          <p className="text-muted-foreground">Discover repositories and patterns for your SaaS</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search repositories..." 
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.name} className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                </div>
                <Badge variant="secondary">{category.count}</Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Trending Repositories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Trending Repositories</h2>
          <Button variant="ghost" size="sm">
            View All
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4">
          {repositories.map((repo) => (
            <Card key={repo.name} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {repo.description}
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Star className="mr-2 h-4 w-4" />
                    Star
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    {repo.language}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stars.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {repo.forks}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {repo.updated}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {repo.topics.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{repo.topics.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
          <CardDescription>
            Curated guides and tutorials for building SaaS applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Building a Modern Dashboard",
                description: "Learn how to create responsive admin dashboards",
                icon: "📊"
              },
              {
                title: "Authentication Patterns",
                description: "Implement secure auth flows in your app",
                icon: "🔒"
              },
              {
                title: "API Best Practices",
                description: "Design scalable and maintainable APIs",
                icon: "⚡"
              },
              {
                title: "Database Design",
                description: "Structure your data for growth and performance",
                icon: "💾"
              },
            ].map((resource) => (
              <div 
                key={resource.title}
                className="flex items-start gap-3 p-4 rounded-lg border transition-all hover:shadow-sm hover:border-primary/50 cursor-pointer"
              >
                <div className="text-2xl">{resource.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">{resource.title}</h3>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
