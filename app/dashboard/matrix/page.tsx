import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MatrixPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Matrix</CardTitle>
          <CardDescription>
            Compare proposal elements side by side to spot gaps quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use this canvas for the comparison matrix tools. Update the markup
            here as the feature evolves without touching the persistent sidebar
            or global header.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
