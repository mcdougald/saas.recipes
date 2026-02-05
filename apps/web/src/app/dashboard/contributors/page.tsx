import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UsersRound, GitBranch, GitCommit, Award, Mail, Plus } from "lucide-react"

export default function ContributorsPage() {
  const contributors = [
    {
      id: 1,
      name: "Alice Chen",
      initials: "AC",
      role: "Head Chef",
      email: "alice@saasrecipes.com",
      commits: 342,
      branches: 28,
      specialty: "Frontend Architecture",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      name: "Bob Martinez",
      initials: "BM",
      role: "Sous Chef",
      email: "bob@saasrecipes.com",
      commits: 287,
      branches: 19,
      specialty: "Backend Development",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      id: 3,
      name: "Carol Davis",
      initials: "CD",
      role: "Pastry Chef",
      email: "carol@saasrecipes.com",
      commits: 198,
      branches: 15,
      specialty: "UI/UX Design",
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 4,
      name: "David Kim",
      initials: "DK",
      role: "Line Cook",
      email: "david@saasrecipes.com",
      commits: 156,
      branches: 12,
      specialty: "Testing & QA",
      color: "bg-orange-100 text-orange-600"
    },
    {
      id: 5,
      name: "Emma Wilson",
      initials: "EW",
      role: "Prep Cook",
      email: "emma@saasrecipes.com",
      commits: 124,
      branches: 8,
      specialty: "DevOps",
      color: "bg-pink-100 text-pink-600"
    },
    {
      id: 6,
      name: "Frank Torres",
      initials: "FT",
      role: "Kitchen Assistant",
      email: "frank@saasrecipes.com",
      commits: 89,
      branches: 6,
      specialty: "Documentation",
      color: "bg-amber-100 text-amber-600"
    }
  ]

  const stats = [
    {
      label: "Total Chefs",
      value: "6",
      icon: UsersRound,
      description: "Active contributors",
      color: "text-blue-600"
    },
    {
      label: "Total Commits",
      value: "1,196",
      icon: GitCommit,
      description: "Recipes perfected",
      color: "text-emerald-600"
    },
    {
      label: "Active Branches",
      value: "88",
      icon: GitBranch,
      description: "Dishes in progress",
      color: "text-purple-600"
    },
    {
      label: "Specialties",
      value: "6",
      icon: Award,
      description: "Unique skills",
      color: "text-orange-600"
    }
  ]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Contributors</h1>
          <p className="text-muted-foreground">
            Meet the chefs who are cooking up this amazing SaaS together
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Chef
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="transition-all hover:shadow-lg hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Contributors Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contributors.map((contributor) => (
          <Card key={contributor.id} className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={contributor.color}>
                    {contributor.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{contributor.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    {contributor.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="secondary" className="mb-3">
                  {contributor.role}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  <strong>Specialty:</strong> {contributor.specialty}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <GitCommit className="h-3 w-3" />
                    <span className="text-xs">Commits</span>
                  </div>
                  <p className="text-lg font-bold">{contributor.commits}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <GitBranch className="h-3 w-3" />
                    <span className="text-xs">Branches</span>
                  </div>
                  <p className="text-lg font-bold">{contributor.branches}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Insights */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Kitchen Insights</CardTitle>
          <CardDescription>
            How our chef team collaborates to create the perfect recipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Most Active Chef This Week</p>
                <p className="text-sm text-muted-foreground">Alice Chen - 47 commits</p>
              </div>
              <Award className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Kitchen Collaboration Score</p>
                <p className="text-sm text-muted-foreground">Excellent team coordination and communication</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                95%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Average Recipe Time</p>
                <p className="text-sm text-muted-foreground">From branch to merge</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                2.3 days
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
