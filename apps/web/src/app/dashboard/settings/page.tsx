import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Upload } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {/* Profile Settings */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and profile photo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p className="text-sm font-medium">Profile Photo</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Upload className="mr-2 h-3 w-3" />
                    Upload New
                  </Button>
                  <Button size="sm" variant="ghost">Remove</Button>
                </div>
              </div>
            </div>
            
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Display Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  defaultValue="John Doe"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  defaultValue="john@example.com"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="role">
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  value="Administrator"
                  disabled
                  className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="timezone">
                  Timezone
                </label>
                <select
                  id="timezone"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option>UTC (GMT+0:00)</option>
                  <option>EST (GMT-5:00)</option>
                  <option>PST (GMT-8:00)</option>
                </select>
              </div>
            </div>
            <Button className="w-fit">Save Changes</Button>
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between rounded-lg border p-4">
              <div className="space-y-0.5 flex-1">
                <label className="text-sm font-medium">Email Notifications</label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your account activity
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4 mt-1" defaultChecked />
            </div>
            
            <div className="flex items-start justify-between rounded-lg border p-4">
              <div className="space-y-0.5 flex-1">
                <label className="text-sm font-medium">Weekly Digest</label>
                <p className="text-sm text-muted-foreground">
                  Get a weekly summary of your activity and updates
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4 mt-1" defaultChecked />
            </div>
            
            <div className="flex items-start justify-between rounded-lg border p-4">
              <div className="space-y-0.5 flex-1">
                <label className="text-sm font-medium">Marketing Emails</label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and updates
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4 mt-1" />
            </div>
            
            <Button className="w-fit">Update Preferences</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <Shield className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Password</label>
                <p className="text-sm text-muted-foreground">
                  Last changed 30 days ago
                </p>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Two-Factor Authentication</label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Badge variant="secondary">Not Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Active Sessions</label>
                <p className="text-sm text-muted-foreground">
                  3 active sessions across devices
                </p>
              </div>
              <Button variant="outline" size="sm">Manage Sessions</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Danger Zone */}
        <Card className="shadow-md border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Delete Account</label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
