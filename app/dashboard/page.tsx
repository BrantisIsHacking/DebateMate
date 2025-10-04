"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, MessageSquare, TrendingUp, Award, Plus, LogOut } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
}

interface Analytics {
  totalDebates: number
  totalFallacies: number
  averageScores: {
    avg_clarity: number
    avg_evidence: number
    avg_logic: number
    avg_persuasiveness: number
    avg_overall: number
  }
}

interface RecentDebate {
  id: string
  topic: string
  position: string
  opponent_type: string
  status: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [recentDebates, setRecentDebates] = useState<RecentDebate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(userStr)
    setUser(userData)

    // Fetch analytics and recent debates
    fetchDashboardData(userData.id)
  }, [router])

  const fetchDashboardData = async (userId: string) => {
    try {
      const [analyticsRes, debatesRes] = await Promise.all([
        fetch(`/api/analytics/${userId}`),
        fetch(`/api/debates/${userId}`),
      ])

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }

      if (debatesRes.ok) {
        const debatesData = await debatesRes.json()
        setRecentDebates(debatesData.debates.slice(0, 5))
      }
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const fallacyReduction =
    analytics && analytics.totalDebates > 0
      ? Math.max(0, 100 - (analytics.totalFallacies / analytics.totalDebates) * 10)
      : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">DebateMate.Tech</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Debate Dashboard</h1>
          <p className="text-lg text-muted-foreground">Track your progress and start new debates</p>
        </div>

        {/* Quick Action */}
        <div className="mb-8">
          <Link href="/debate/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Start New Debate
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardDescription>Total Debates</CardDescription>
              <CardTitle className="text-4xl text-primary">{analytics?.totalDebates || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>All time</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardDescription>Fallacy Reduction</CardDescription>
              <CardTitle className="text-4xl text-accent">{fallacyReduction.toFixed(0)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={fallacyReduction} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardDescription>Avg Argument Score</CardDescription>
              <CardTitle className="text-4xl text-chart-3">
                {analytics?.averageScores.avg_overall?.toFixed(0) || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Out of 100</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardDescription>Skill Level</CardDescription>
              <CardTitle className="text-4xl text-chart-4">
                {analytics && analytics.averageScores.avg_overall > 80
                  ? "Expert"
                  : analytics && analytics.averageScores.avg_overall > 60
                    ? "Advanced"
                    : analytics && analytics.averageScores.avg_overall > 40
                      ? "Intermediate"
                      : "Beginner"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Keep improving</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Progress */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Argument Quality Breakdown</CardTitle>
              <CardDescription>Your average scores across key metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Clarity</span>
                  <span className="text-sm text-muted-foreground">
                    {analytics?.averageScores.avg_clarity?.toFixed(0) || 0}/100
                  </span>
                </div>
                <Progress value={analytics?.averageScores.avg_clarity || 0} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Evidence Quality</span>
                  <span className="text-sm text-muted-foreground">
                    {analytics?.averageScores.avg_evidence?.toFixed(0) || 0}/100
                  </span>
                </div>
                <Progress value={analytics?.averageScores.avg_evidence || 0} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Logical Consistency</span>
                  <span className="text-sm text-muted-foreground">
                    {analytics?.averageScores.avg_logic?.toFixed(0) || 0}/100
                  </span>
                </div>
                <Progress value={analytics?.averageScores.avg_logic || 0} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Persuasiveness</span>
                  <span className="text-sm text-muted-foreground">
                    {analytics?.averageScores.avg_persuasiveness?.toFixed(0) || 0}/100
                  </span>
                </div>
                <Progress value={analytics?.averageScores.avg_persuasiveness || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Recent Debates</CardTitle>
              <CardDescription>Your latest debate sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentDebates.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No debates yet</p>
                  <Link href="/debate/new">
                    <Button>Start Your First Debate</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDebates.map((debate) => (
                    <Link key={debate.id} href={`/debate/${debate.id}`}>
                      <div className="p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-foreground text-sm line-clamp-1">{debate.topic}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              debate.status === "completed" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                            }`}
                          >
                            {debate.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {debate.position} • vs {debate.opponent_type}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Tips to Improve</CardTitle>
            <CardDescription>Personalized recommendations based on your performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analytics && analytics.averageScores.avg_evidence < 70 && (
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Strengthen Your Evidence</p>
                    <p className="text-sm text-muted-foreground">
                      Back up your claims with credible sources and data to improve your evidence score
                    </p>
                  </div>
                </li>
              )}
              {analytics && analytics.averageScores.avg_logic < 70 && (
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Watch for Logical Fallacies</p>
                    <p className="text-sm text-muted-foreground">
                      Review common fallacies and practice identifying them in your arguments
                    </p>
                  </div>
                </li>
              )}
              {analytics && analytics.averageScores.avg_clarity < 70 && (
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-chart-3 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Improve Clarity</p>
                    <p className="text-sm text-muted-foreground">
                      Structure your arguments more clearly with topic sentences and supporting points
                    </p>
                  </div>
                </li>
              )}
              {(!analytics ||
                (analytics.averageScores.avg_evidence >= 70 &&
                  analytics.averageScores.avg_logic >= 70 &&
                  analytics.averageScores.avg_clarity >= 70)) && (
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Keep Up the Great Work!</p>
                    <p className="text-sm text-muted-foreground">
                      Your scores are strong. Challenge yourself with more complex topics and tougher opponents
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
