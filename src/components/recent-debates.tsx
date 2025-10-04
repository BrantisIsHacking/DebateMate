import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MessageSquare } from "lucide-react"

const debates = [
  {
    id: "1",
    topic: "Should AI be regulated by governments?",
    opponent: "Policy Expert AI",
    date: "2 hours ago",
    result: "Won",
    score: 85,
    fallacies: 2,
  },
  {
    id: "2",
    topic: "Is remote work better for productivity?",
    opponent: "Business Analyst AI",
    date: "Yesterday",
    result: "Lost",
    score: 72,
    fallacies: 5,
  },
  {
    id: "3",
    topic: "Should college education be free?",
    opponent: "Economist AI",
    date: "2 days ago",
    result: "Won",
    score: 91,
    fallacies: 1,
  },
]

export function RecentDebates() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Debates</CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {debates.map((debate) => (
          <Link key={debate.id} href={`/feedback/${debate.id}`}>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-border cursor-pointer">
              <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm leading-tight text-pretty">{debate.topic}</h3>
                  <Badge
                    variant={debate.result === "Won" ? "default" : "secondary"}
                    className={
                      debate.result === "Won" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""
                    }
                  >
                    {debate.result}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {debate.date}
                  </span>
                  <span>vs {debate.opponent}</span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Score:</span>
                    <span className="font-semibold text-primary">{debate.score}/100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Fallacies:</span>
                    <span className="font-semibold">{debate.fallacies}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
