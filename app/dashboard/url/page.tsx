import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UrlPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>URL Library</CardTitle>
          <CardDescription>
            Centralize reference links for fast access during proposal builds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Populate this screen with the bookmarking experience. The shared
            dashboard shell already guarantees the sidebar and header stay
            rendered while you swap the main content.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
