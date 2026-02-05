import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Users, FileText, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23.5%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
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
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <Users className="h-4 w-4" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    New user registration
                  </p>
                  <p className="text-sm text-muted-foreground">
                    John Doe signed up
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">2m ago</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Document uploaded
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Q4-Report.pdf
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">15m ago</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <Users className="h-4 w-4" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    New team member
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jane Smith joined the team
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">1h ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add New User
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
