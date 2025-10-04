import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Swords, BookOpen, BarChart3, Settings } from "lucide-react"

const actions = [
  {
    label: "Quick Debate",
    description: "Start a 5-min practice",
    icon: Swords,
    variant: "default" as const,
  },
  {
    label: "Study Fallacies",
    description: "Learn common mistakes",
    icon: BookOpen,
    variant: "outline" as const,
  },
  {
    label: "View Analytics",
    description: "Deep dive into stats",
    icon: BarChart3,
    variant: "outline" as const,
  },
  {
    label: "Settings",
    description: "Customize experience",
    icon: Settings,
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button key={action.label} variant={action.variant} className="w-full justify-start gap-3 h-auto py-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
