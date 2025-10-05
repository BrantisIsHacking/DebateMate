"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ArrowLeft,
  Lightbulb,
  Target,
  Award,
} from "lucide-react"

// Mock debate data - would come from database in production
const mockDebateData = {
  id: "1",
  topic: "Should AI be regulated by governments?",
  opponent: "politician",
  duration: 10,
  userArguments: [
    "AI systems are becoming increasingly powerful and autonomous. Without proper regulation, we risk creating systems that could cause significant harm to society. We need government oversight to ensure AI development aligns with human values and safety standards.",
    "Look at the success of regulations in other industries like pharmaceuticals and aviation. These regulations have saved countless lives. AI has the potential to be even more impactful, so we need similar safeguards in place before it's too late.",
  ],
  completedAt: new Date(),
}

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [selectedArgument, setSelectedArgument] = useState(0)

  useEffect(() => {
    // Analyze all user arguments
    const analyzeDebate = async () => {
      setIsAnalyzing(true)
      try {
        const response = await fetch("/api/debate/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            argument: mockDebateData.userArguments[selectedArgument],
            topic: mockDebateData.topic,
          }),
        })

        const data = await response.json()
        setAnalysis(data.analysis)
      } catch (error) {
        console.error("[v0] Failed to analyze debate:", error)
      } finally {
        setIsAnalyzing(false)
      }
    }

    analyzeDebate()
  }, [selectedArgument])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Debate Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Debate Feedback</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{mockDebateData.topic}</span>
            <span>•</span>
            <Badge variant="outline" className="capitalize">
              vs {mockDebateData.opponent}
            </Badge>
            <span>•</span>
            <span>{mockDebateData.duration} minutes</span>
          </div>
        </div>

        {/* Overall Score Card */}
        {analysis && (
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overall Performance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{analysis.score}</span>
                    <span className="text-2xl text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={analysis.score >= 80 ? "default" : "secondary"}
                    className={
                      analysis.score >= 80
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : analysis.score >= 60
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : ""
                    }
                  >
                    {analysis.score >= 80 ? "Excellent" : analysis.score >= 60 ? "Good" : "Needs Work"}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">+{Math.floor(analysis.score / 10)} XP earned</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Argument Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Your Arguments
            </CardTitle>
            <CardDescription>Select an argument to see detailed feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockDebateData.userArguments.map((arg, index) => (
              <button
                key={index}
                onClick={() => setSelectedArgument(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedArgument === index
                    ? "border-primary bg-primary/5"
                    : "border-border bg-secondary/20 hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">
                    #{index + 1}
                  </Badge>
                  <p className="text-sm leading-relaxed flex-1">{arg}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        {isAnalyzing ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Analyzing your argument...</span>
              </div>
            </CardContent>
          </Card>
        ) : analysis ? (
          <Tabs defaultValue="fallacies" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fallacies">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Fallacies
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <Target className="h-4 w-4 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="suggestions">
                <Lightbulb className="h-4 w-4 mr-2" />
                Suggestions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fallacies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Logical Fallacies Detected
                  </CardTitle>
                  <CardDescription>
                    {analysis.logicalFallacies?.length === 0
                      ? "Great job! No logical fallacies detected."
                      : `Found ${analysis.logicalFallacies?.length || 0} logical fallacy(ies) in your argument.`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.logicalFallacies?.length === 0 ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <p className="text-sm text-emerald-500">
                        Your argument is logically sound with no detected fallacies!
                      </p>
                    </div>
                  ) : (
                    analysis.logicalFallacies?.map((fallacy: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div className="flex-1 space-y-2">
                            <div>
                              <Badge variant="destructive" className="mb-2">
                                {fallacy.type}
                              </Badge>
                              <p className="text-sm font-medium">{fallacy.location}</p>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{fallacy.explanation}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle2 className="h-5 w-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.strengths?.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span className="leading-relaxed">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-500">
                      <TrendingUp className="h-5 w-5" />
                      Areas to Improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.weaknesses?.map((weakness: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-yellow-500 mt-1">•</span>
                          <span className="leading-relaxed">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Actionable Suggestions
                  </CardTitle>
                  <CardDescription>Specific ways to improve your debate skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.suggestions?.map((suggestion: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
                      >
                        <div className="bg-primary rounded-full p-1.5 flex-shrink-0">
                          <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                        </div>
                        <p className="text-sm leading-relaxed flex-1">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : null}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
          <Button onClick={() => router.push("/debate/new")}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Start New Debate
          </Button>
        </div>
      </main>
    </div>
  )
}