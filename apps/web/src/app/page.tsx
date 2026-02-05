import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Shield, Zap, Users, Globe, Lock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <BarChart3 className="h-6 w-6" />
            <span>SaaS Recipes</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/dashboard">
              <Button>
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Built with Next.js 16 & TailwindCSS 4</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              You&apos;re No Longer Alone in the Kitchen
              <span className="block bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Your SaaS Recipe for Success
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Building a SaaS is like cooking a gourmet meal—you need the right ingredients, expert chefs, and a well-equipped kitchen. 
              With SaaS Recipes, you have access to all the tools, contributors, and dependencies to craft something extraordinary.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 border-t bg-muted/20">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              All the Ingredients for Success
            </h2>
            <p className="text-lg text-muted-foreground">
              Just like a professional kitchen, we provide everything you need to cook up your perfect SaaS application.
            </p>
          </div>
          
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track your recipe&apos;s performance with real-time metrics and insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Team of Chefs</CardTitle>
                <CardDescription>
                  Collaborate with fellow chefs—manage contributors who help perfect your recipe
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Quality Ingredients</CardTitle>
                <CardDescription>
                  Built with the finest dependencies—security-first, battle-tested packages
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fast Cooking</CardTitle>
                <CardDescription>
                  Lightning-fast preparation with Next.js 16 and Turbopack—serve hot and fresh
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Serves All Guests</CardTitle>
                <CardDescription>
                  Beautiful presentation on every plate—responsive design for all devices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Recipe Book</CardTitle>
                <CardDescription>
                  Type-safe instructions with TypeScript—follow the recipe exactly every time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Ready to cook together?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join a kitchen full of talented chefs. See who&apos;s contributing to your success, explore the ingredients powering your app, and start cooking up something amazing together.
            </p>
            <Link href="/dashboard">
              <Button size="lg">
                Explore Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="container px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 font-semibold">
              <BarChart3 className="h-5 w-5" />
              <span>SaaS Recipes</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, TailwindCSS, and shadcn/ui
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
