import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Target, Award, Zap } from "lucide-react"

const stats = [
  {
    label: "Total Debates",
    value: "24",
    change: "+3 this week",
    icon: Target,
    trend: "up",
  },
  {
    label: "Win Rate",
    value: "68%",
    change: "+12% improvement",
    icon: Award,
    trend: "up",
  },
  {
    label: "Fallacies Reduced",
    value: "20%",
    change: "vs last month",
    icon: TrendingUp,
    trend: "up",
  },
  {
    label: "Current Streak",
    value: "7 days",
    change: "Keep it up!",
    icon: Zap,
    trend: "neutral",
  },
]

export function StatsCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                {stat.trend === "up" && <span className="text-xs text-emerald-500 font-medium">↑</span>}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-primary font-medium">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
