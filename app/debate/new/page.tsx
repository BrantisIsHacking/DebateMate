"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, ArrowLeft } from "lucide-react"

export default function NewDebatePage() {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [position, setPosition] = useState<"for" | "against">("for")
  const [opponentType, setOpponentType] = useState("politician")
  const [isLoading, setIsLoading] = useState(false)

  const handleStartDebate = async () => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(userStr)
    setIsLoading(true)

    try {
      const response = await fetch("/api/debates/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          topic,
          position,
          opponentType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create debate")
      }

      router.push(`/debate/${data.debate.id}`)
    } catch (error) {
      console.error("[v0] Error creating debate:", error)
      alert("Failed to create debate. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">DebateMate.Tech</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-3xl">Start a New Debate</CardTitle>
            <CardDescription>Choose your topic, position, and opponent to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Debate Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Social media does more harm than good"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">Choose a clear, debatable statement</p>
            </div>

            <div className="space-y-2">
              <Label>Your Position</Label>
              <RadioGroup value={position} onValueChange={(value) => setPosition(value as "for" | "against")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="for" id="for" />
                  <Label htmlFor="for" className="font-normal cursor-pointer">
                    For (I support this statement)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="against" id="against" />
                  <Label htmlFor="against" className="font-normal cursor-pointer">
                    Against (I oppose this statement)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="opponent">Opponent Type</Label>
              <Select value={opponentType} onValueChange={setOpponentType}>
                <SelectTrigger id="opponent" className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="politician">Politician - Persuasive and diplomatic</SelectItem>
                  <SelectItem value="scientist">Scientist - Data-driven and analytical</SelectItem>
                  <SelectItem value="activist">Activist - Passionate and values-focused</SelectItem>
                  <SelectItem value="philosopher">Philosopher - Abstract and theoretical</SelectItem>
                  <SelectItem value="journalist">Journalist - Fact-checking and investigative</SelectItem>
                  <SelectItem value="lawyer">Lawyer - Logical and precedent-based</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Each opponent has a unique arguing style</p>
            </div>

            <Button onClick={handleStartDebate} disabled={!topic || isLoading} className="w-full" size="lg">
              {isLoading ? "Starting Debate..." : "Start Debate"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Popular Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "AI will replace most jobs",
                "Social media does more harm than good",
                "Climate change is the biggest threat",
                "Free speech should have limits",
                "Universal basic income is necessary",
              ].map((popularTopic) => (
                <Button
                  key={popularTopic}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopic(popularTopic)}
                  className="text-xs"
                >
                  {popularTopic}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
