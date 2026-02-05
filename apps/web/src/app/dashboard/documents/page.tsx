import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, Eye, Search, Filter, File } from "lucide-react"

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    gray: "bg-gray-100 text-gray-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  }
  return colors[color] || colors.gray
}

export default function DocumentsPage() {
  const documents = [
    { id: 1, name: "Q4-Report.pdf", size: "2.4 MB", date: "2024-02-01", type: "PDF", color: "red" },
    { id: 2, name: "Strategy-2024.docx", size: "1.1 MB", date: "2024-01-28", type: "Document", color: "blue" },
    { id: 3, name: "Budget-Analysis.xlsx", size: "890 KB", date: "2024-01-25", type: "Spreadsheet", color: "green" },
    { id: 4, name: "Meeting-Notes.txt", size: "45 KB", date: "2024-01-20", type: "Text", color: "gray" },
    { id: 5, name: "Presentation.pptx", size: "5.2 MB", date: "2024-01-15", type: "Presentation", color: "orange" },
    { id: 6, name: "Design-Assets.zip", size: "15.8 MB", date: "2024-01-10", type: "Archive", color: "purple" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Documents</h1>
          <p className="text-muted-foreground">Manage and organize your files and documents</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="search"
            aria-label="Search documents"
            placeholder="Search documents..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Documents</CardDescription>
            <CardTitle className="text-3xl">{documents.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Size</CardDescription>
            <CardTitle className="text-3xl">25.4 MB</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Recent Uploads</CardDescription>
            <CardTitle className="text-3xl">4</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            All your files in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/30 transition-colors"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${getColorClasses(doc.color)}`}>
                  <File className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
