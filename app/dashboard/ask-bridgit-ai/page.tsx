import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AskBridgitAIPage() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Ask Bridgit AI</CardTitle>
          <CardDescription>
            Direct access to the AI assistant for answering project questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a placeholder view. Replace the content here with the chat
            interface or workflow you plan for Ask Bridgit AI so the sidebar and
            header remain untouched while the main panel updates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
