import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Search, Filter } from "lucide-react"

export default function UsersPage() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", avatar: "JD" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active", avatar: "JS" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive", avatar: "BJ" },
    { id: 4, name: "Alice Williams", email: "alice@example.com", role: "Manager", status: "Active", avatar: "AW" },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "Active", avatar: "CB" },
    { id: 6, name: "Diana Prince", email: "diana@example.com", role: "Manager", status: "Active", avatar: "DP" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Users</h1>
          <p className="text-muted-foreground">Manage your team members and their permissions</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="search"
            aria-label="Search users"
            placeholder="Search users..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {users.length} total users in your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">User</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={user.status === "Active" ? "default" : "outline"}
                          className={user.status === "Active" 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200" 
                            : ""}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
