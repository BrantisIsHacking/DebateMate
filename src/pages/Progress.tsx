"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Trophy, TrendingUp, Target, Award, Calendar, BarChart3, MessageSquare, Zap, Clock } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock user progress data
const mockProgressData = {
  level: 7,
  xp: 2450,
  xpToNextLevel: 3000,
  totalDebates: 24,
  winRate: 67,
  averageScore: 78,
  streak: 5,
  achievements: [
    { id: 1, name: "First Debate", description: "Complete your first debate", unlocked: true, icon: "🎯" },
    { id: 2, name: "Winning Streak", description: "Win 5 debates in a row", unlocked: true, icon: "🔥" },
    { id: 3, name: "Logic Master", description: "Complete a debate with no fallacies", unlocked: true, icon: "🧠" },
    { id: 4, name: "Debate Champion", description: "Win 10 debates", unlocked: false, icon: "🏆" },
    { id: 5, name: "Persuasion Expert", description: "Score 90+ in 5 debates", unlocked: false, icon: "⭐" },
    { id: 6, name: "Marathon Debater", description: "Complete 50 debates", unlocked: false, icon: "🎖️" },
  ],
  recentDebates: [
    { id: 1, topic: "AI Regulation", score: 85, date: "2025-01-08", opponent: "politician" },
    { id: 2, topic: "Climate Change Policy", score: 72, date: "2025-01-07", opponent: "scientist" },
    { id: 3, topic: "Universal Basic Income", score: 88, date: "2025-01-06", opponent: "economist" },
    { id: 4, topic: "Space Exploration", score: 76, date: "2025-01-05", opponent: "engineer" },
    { id: 5, topic: "Education Reform", score: 81, date: "2025-01-04", opponent: "teacher" },
  ],
  skillProgress: [
    { skill: "Logic", level: 8, progress: 75 },
    { skill: "Rhetoric", level: 6, progress: 45 },
    { skill: "Evidence", level: 7, progress: 60 },
    { skill: "Rebuttal", level: 5, progress: 30 },
    { skill: "Persuasion", level: 7, progress: 55 },
  ],
  performanceHistory: [
    { week: "Week 1", score: 65 },
    { week: "Week 2", score: 70 },
    { week: "Week 3", score: 72 },
    { week: "Week 4", score: 78 },
  ],
}

export default function ProgressPage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(mockProgressData)
  const xpPercentage = (progress.xp / progress.xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">Track your debate skills and achievements</p>
        </div>

        {/* Level & XP Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-full p-4">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <p className="text-4xl font-bold">Level {progress.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">XP Progress</p>
                <p className="text-2xl font-bold">
                  {progress.xp} / {progress.xpToNextLevel}
                </p>
              </div>
            </div>
            <Progress value={xpPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {progress.xpToNextLevel - progress.xp} XP until Level {progress.level + 1}
            </p>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Debates</p>
                  <p className="text-3xl font-bold">{progress.totalDebates}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                  <p className="text-3xl font-bold">{progress.winRate}%</p>
                </div>
                <Target className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Score</p>
                  <p className="text-3xl font-bold">{progress.averageScore}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="text-3xl font-bold">{progress.streak}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">
              <TrendingUp className="h-4 w-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Award className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="history">
              <Calendar className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Skill Development</CardTitle>
                <CardDescription>Track your progress across different debate skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {progress.skillProgress.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant="outline">Level {skill.level}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  {progress.achievements.filter((a) => a.unlocked).length} of {progress.achievements.length} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {progress.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.unlocked
                          ? "bg-primary/5 border-primary/20"
                          : "bg-secondary/20 border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{achievement.name}</p>
                            {achievement.unlocked && (
                              <Badge variant="default" className="bg-emerald-500">
                                Unlocked
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Debates</CardTitle>
                <CardDescription>Your last {progress.recentDebates.length} debate performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progress.recentDebates.map((debate) => (
                    <div
                      key={debate.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
                      onClick={() => navigate(`/feedback/${debate.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            debate.score >= 80
                              ? "bg-emerald-500/20 text-emerald-500"
                              : debate.score >= 60
                                ? "bg-yellow-500/20 text-yellow-500"
                                : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {debate.score}
                        </div>
                        <div>
                          <p className="font-medium">{debate.topic}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{debate.date}</span>
                            <span>•</span>
                            <Badge variant="outline" className="capitalize">
                              vs {debate.opponent}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your debate scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progress.performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
                <CardDescription>Compare your skill levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progress.skillProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="level" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button size="lg" onClick={() => navigate("/arena")}>
            <MessageSquare className="h-5 w-5 mr-2" />
            Start New Debate
          </Button>
        </div>
      </main>
    </div>
  )
}
