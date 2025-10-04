import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const skills = [
  { name: "Logical Reasoning", progress: 85, color: "bg-primary" },
  { name: "Evidence Usage", progress: 72, color: "bg-accent" },
  { name: "Rebuttal Strength", progress: 68, color: "bg-chart-3" },
  { name: "Clarity", progress: 91, color: "bg-chart-4" },
]

export function SkillProgress() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Skill Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{skill.name}</span>
              <span className="text-muted-foreground">{skill.progress}%</span>
            </div>
            <Progress value={skill.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
