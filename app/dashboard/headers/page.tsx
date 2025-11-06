import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HeadersPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Headers</CardTitle>
          <CardDescription>
            Manage reusable document headers and keep messaging consistent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Build your headers UI in this panel. The shared dashboard layout keeps
            the sidebar and top navigation in place while you flesh out the
            header library experience.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
