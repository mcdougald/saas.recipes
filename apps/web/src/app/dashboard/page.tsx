import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, GitBranch, GitCommit, GitPullRequest, Package, Shield, TrendingUp, Code, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Repository Analysis</h1>
          <p className="text-muted-foreground">Overview of your SaaS project health and activity</p>
        </div>
        <Button>
          <Code className="mr-2 h-4 w-4" />
          View Code
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitCommit className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">+42</span> this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
            <GitBranch className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-blue-600 font-medium">+3</span> new this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
            <GitPullRequest className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-purple-600 font-medium">12 open</span> · 6 merged
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-orange-600" />
              <span className="text-orange-600 font-medium">3 updates</span> available
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {/* Recent Commits */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Commits</CardTitle>
              <CardDescription>
                Latest changes to the repository
              </CardDescription>
            </div>
            <Button size="sm" className="ml-auto gap-1">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <GitCommit className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Add user authentication flow
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Alice Chen · main branch
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">2h ago</div>
              </div>
              
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <GitCommit className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Fix responsive layout issues
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Bob Martinez · develop branch
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">5h ago</div>
              </div>
              
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <GitCommit className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Update dependencies to latest versions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Carol Davis · feature/deps-update
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">1d ago</div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <GitCommit className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1 grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Implement dark mode toggle
                  </p>
                  <p className="text-sm text-muted-foreground">
                    David Kim · feature/dark-mode
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">2d ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Repository Health & Stats */}
        <div className="grid gap-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Repository Health</CardTitle>
              <CardDescription>
                Code quality and security metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Code Coverage</span>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Excellent</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "87%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">87% of code covered</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Security Score</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">A+</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">No vulnerabilities detected</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Build Status</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">Passing</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">All checks passed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common repository tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-shadow" variant="outline">
                <GitPullRequest className="mr-3 h-5 w-5 text-blue-600" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Create Pull Request</span>
                  <span className="text-xs text-muted-foreground">Merge your changes</span>
                </div>
              </Button>
              <Button className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-shadow" variant="outline">
                <Package className="mr-3 h-5 w-5 text-orange-600" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Update Dependencies</span>
                  <span className="text-xs text-muted-foreground">Review and update packages</span>
                </div>
              </Button>
              <Button className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-shadow" variant="outline">
                <Shield className="mr-3 h-5 w-5 text-emerald-600" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Security Scan</span>
                  <span className="text-xs text-muted-foreground">Run vulnerability check</span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
