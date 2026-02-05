import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"

export default function DocumentsPage() {
  const documents = [
    { id: 1, name: "Q4-Report.pdf", size: "2.4 MB", date: "2024-02-01", type: "PDF" },
    { id: 2, name: "Strategy-2024.docx", size: "1.1 MB", date: "2024-01-28", type: "Document" },
    { id: 3, name: "Budget-Analysis.xlsx", size: "890 KB", date: "2024-01-25", type: "Spreadsheet" },
    { id: 4, name: "Meeting-Notes.txt", size: "45 KB", date: "2024-01-20", type: "Text" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Documents</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            Manage and organize your documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.type} • {doc.size} • {doc.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
