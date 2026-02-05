import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Shield, Zap, ArrowUpRight, CheckCircle2, AlertTriangle, Plus } from "lucide-react"

export default function DependenciesPage() {
  const dependencies = [
    {
      id: 1,
      name: "next",
      version: "16.0.0",
      description: "The React Framework for Production",
      type: "Main Ingredient",
      status: "fresh",
      security: "secure",
      lastUpdated: "2 days ago",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      name: "react",
      version: "19.0.0",
      description: "JavaScript library for building UI",
      type: "Main Ingredient",
      status: "fresh",
      security: "secure",
      lastUpdated: "1 week ago",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 3,
      name: "tailwindcss",
      version: "4.0.0",
      description: "Utility-first CSS framework",
      type: "Seasoning",
      status: "fresh",
      security: "secure",
      lastUpdated: "3 days ago",
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 4,
      name: "typescript",
      version: "5.6.0",
      description: "Typed JavaScript at Any Scale",
      type: "Kitchen Tool",
      status: "fresh",
      security: "secure",
      lastUpdated: "1 week ago",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      id: 5,
      name: "lucide-react",
      version: "0.460.0",
      description: "Beautiful & consistent icon set",
      type: "Garnish",
      status: "fresh",
      security: "secure",
      lastUpdated: "5 days ago",
      color: "bg-orange-100 text-orange-600"
    },
    {
      id: 6,
      name: "turbo",
      version: "1.11.2",
      description: "High-performance build system",
      type: "Kitchen Tool",
      status: "update-available",
      security: "secure",
      lastUpdated: "2 weeks ago",
      color: "bg-emerald-100 text-emerald-600"
    }
  ]

  const stats = [
    {
      label: "Total Ingredients",
      value: "42",
      icon: Package,
      description: "Dependencies installed",
      color: "text-blue-600"
    },
    {
      label: "Security Score",
      value: "A+",
      icon: Shield,
      description: "No vulnerabilities",
      color: "text-emerald-600"
    },
    {
      label: "Performance",
      value: "Excellent",
      icon: Zap,
      description: "Optimized packages",
      color: "text-orange-600"
    },
    {
      label: "Updates Available",
      value: "3",
      icon: ArrowUpRight,
      description: "New versions ready",
      color: "text-purple-600"
    }
  ]

  const categories = [
    { name: "Main Ingredients", count: 8, description: "Core frameworks & libraries" },
    { name: "Seasonings", count: 12, description: "Styling & UI enhancements" },
    { name: "Kitchen Tools", count: 15, description: "Build tools & utilities" },
    { name: "Garnishes", count: 7, description: "Icons, fonts & extras" }
  ]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dependencies</h1>
          <p className="text-muted-foreground">
            The finest ingredients powering your SaaS recipe
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
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

      {/* Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.name} className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{category.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dependencies List */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredient Inventory</CardTitle>
          <CardDescription>
            All packages and libraries in your pantry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dependencies.map((dep) => (
              <div 
                key={dep.id}
                className="flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md hover:border-primary/50"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${dep.color}`}>
                  <Package className="h-6 w-6" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{dep.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      v{dep.version}
                    </Badge>
                    {dep.status === "fresh" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{dep.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      <Badge variant="secondary" className="text-xs">
                        {dep.type}
                      </Badge>
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {dep.security === "secure" ? "Secure" : "Review needed"}
                    </span>
                    <span>Updated {dep.lastUpdated}</span>
                  </div>
                </div>

                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pantry Health */}
      <Card>
        <CardHeader>
          <CardTitle>Pantry Health</CardTitle>
          <CardDescription>
            Keep your ingredients fresh and secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">Security Audit Passed</p>
                  <p className="text-sm text-emerald-700">No known vulnerabilities detected</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                All Clear
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Bundle Size Optimized</p>
                  <p className="text-sm text-blue-700">Total package size: 2.4 MB (gzipped)</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Excellent
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Updates Available</p>
                  <p className="text-sm text-orange-700">3 packages have new versions ready</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                Update All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
