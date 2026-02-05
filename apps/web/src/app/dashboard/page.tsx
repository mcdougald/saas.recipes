import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Users, FileText, TrendingUp, Activity, DollarSign } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <Button>
          <Activity className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-blue-600 font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-purple-600" />
              <span className="text-purple-600 font-medium">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23.5%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-orange-600" />
              <span className="text-orange-600 font-medium">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your SaaS platform
              </CardDescription>
            </div>
            <Button size="sm" className="ml-auto gap-1">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    New user registration
                  </p>
                  <p className="text-sm text-muted-foreground">
                    John Doe signed up
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">2m ago</div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Document uploaded
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Q4-Report.pdf
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">15m ago</div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-emerald-100 text-emerald-600">JS</AvatarFallback>
                </Avatar>
                <div className="flex-1 grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    New team member
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jane Smith joined the team
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">1h ago</div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-orange-100 text-orange-600">BJ</AvatarFallback>
                </Avatar>
                <div className="flex-1 grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Task completed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Bob Johnson finished the project
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">3h ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions & Stats */}
        <div className="grid gap-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-shadow" variant="outline">
                <Users className="mr-3 h-5 w-5 text-blue-600" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Add New User</span>
                  <span className="text-xs text-muted-foreground">Invite team members</span>
                </div>
              </Button>
              <Button className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-shadow" variant="outline">
                <FileText className="mr-3 h-5 w-5 text-purple-600" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Upload Document</span>
                  <span className="text-xs text-muted-foreground">Add files to library</span>
                </div>
              </Button>
              <Button className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-shadow" variant="outline">
                <TrendingUp className="mr-3 h-5 w-5 text-orange-600" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">View Analytics</span>
                  <span className="text-xs text-muted-foreground">Detailed insights</span>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>
                System health and metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">API Response Time</span>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Good</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">142ms average</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Server Uptime</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">Excellent</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "99%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">99.9% uptime</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">User Satisfaction</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">Great</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "92%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">4.6/5.0 rating</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
