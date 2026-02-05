"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Calendar, Clock, MessageSquare, TrendingUp, User } from "lucide-react"

export function RightSidebar() {
  const notifications = [
    { id: 1, title: "New comment", description: "John commented on your post", time: "5m ago", icon: MessageSquare, unread: true },
    { id: 2, title: "Meeting reminder", description: "Team standup in 30 minutes", time: "25m ago", icon: Calendar, unread: true },
    { id: 3, title: "System update", description: "New features available", time: "1h ago", icon: Bell, unread: false },
    { id: 4, title: "User joined", description: "Sarah joined your workspace", time: "2h ago", icon: User, unread: false },
  ]

  const recentActivity = [
    { id: 1, user: "JD", name: "John Doe", action: "updated a document", time: "10m ago" },
    { id: 2, user: "JS", name: "Jane Smith", action: "created a new project", time: "45m ago" },
    { id: 3, user: "BJ", name: "Bob Johnson", action: "completed a task", time: "1h ago" },
    { id: 4, user: "AW", name: "Alice Williams", action: "commented on an issue", time: "2h ago" },
  ]

  const upcomingEvents = [
    { id: 1, title: "Team Meeting", time: "Today, 2:00 PM", type: "meeting" },
    { id: 2, title: "Project Deadline", time: "Tomorrow", type: "deadline" },
    { id: 3, title: "Weekly Review", time: "Friday, 10:00 AM", type: "review" },
  ]

  return (
    <div className="flex h-full flex-col gap-4 p-4 lg:p-6">
      {/* Notifications Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Notifications</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {notifications.filter(n => n.unread).length} new
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[280px]">
            <div className="space-y-1 px-6 pb-4">
              {notifications.map((notification, index) => {
                const Icon = notification.icon
                return (
                  <div key={notification.id}>
                    <div className="flex gap-3 py-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        notification.unread ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Icon className={`h-4 w-4 ${notification.unread ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                          {notification.unread && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary"></span>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {notification.time}
                        </p>
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <CardDescription className="text-xs">
            Team member activities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[220px]">
            <div className="space-y-1 px-6 pb-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-center gap-3 py-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{activity.user}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  {index < recentActivity.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Upcoming Events Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Upcoming</CardTitle>
          <CardDescription className="text-xs">
            Events and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {event.title}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {event.time}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Users</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-sm font-semibold">156</span>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tasks Done</span>
            <span className="text-sm font-semibold">24/30</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Performance</span>
            <Badge variant="secondary" className="text-xs">95%</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
