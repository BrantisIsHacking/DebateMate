"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Swords, Sparkles } from "lucide-react"

const opponents = [
  { value: "politician", label: "Politician AI", description: "Persuasive and diplomatic" },
  { value: "scientist", label: "Scientist AI", description: "Data-driven and analytical" },
  { value: "activist", label: "Activist AI", description: "Passionate and idealistic" },
  { value: "philosopher", label: "Philosopher AI", description: "Logical and theoretical" },
  { value: "journalist", label: "Journalist AI", description: "Investigative and critical" },
]

const durations = [
  { value: "5", label: "5 minutes - Quick Practice" },
  { value: "10", label: "10 minutes - Standard" },
  { value: "15", label: "15 minutes - Deep Dive" },
]

const suggestedTopics = [
  "Should AI be regulated by governments?",
  "Is remote work better for productivity?",
  "Should college education be free?",
  "Is social media harmful to society?",
  "Should we colonize Mars?",
]

interface DebateSetupProps {
  onStart: (config: { topic: string; opponent: string; duration: number }) => void
}

export function DebateSetup({ onStart }: DebateSetupProps) {
  const [topic, setTopic] = useState("")
  const [opponent, setOpponent] = useState("")
  const [duration, setDuration] = useState("")

  const handleStart = () => {
    if (topic && opponent && duration) {
      onStart({
        topic,
        opponent,
        duration: Number.parseInt(duration),
      })
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-balance">
          <span className="text-primary">Debate Arena</span>
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Choose your topic, opponent, and duration to begin your debate training.
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" />
            Setup Your Debate
          </CardTitle>
          <CardDescription>Configure your debate parameters to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-3">
            <Label htmlFor="topic">Debate Topic</Label>
            <Input
              id="topic"
              placeholder="Enter your debate topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-secondary/50"
            />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Suggested topics:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestedTopic) => (
                  <Button
                    key={suggestedTopic}
                    variant="outline"
                    size="sm"
                    onClick={() => setTopic(suggestedTopic)}
                    className="text-xs"
                  >
                    {suggestedTopic}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Opponent Selection */}
          <div className="space-y-3">
            <Label htmlFor="opponent">AI Opponent</Label>
            <Select value={opponent} onValueChange={setOpponent}>
              <SelectTrigger id="opponent" className="bg-secondary/50">
                <SelectValue placeholder="Select an opponent style..." />
              </SelectTrigger>
              <SelectContent>
                {opponents.map((opp) => (
                  <SelectItem key={opp.value} value={opp.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{opp.label}</span>
                      <span className="text-xs text-muted-foreground">{opp.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-3">
            <Label htmlFor="duration">Debate Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration" className="bg-secondary/50">
                <SelectValue placeholder="Select debate duration..." />
              </SelectTrigger>
              <SelectContent>
                {durations.map((dur) => (
                  <SelectItem key={dur.value} value={dur.value}>
                    {dur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Button */}
          <Button onClick={handleStart} disabled={!topic || !opponent || !duration} className="w-full" size="lg">
            <Swords className="h-4 w-4 mr-2" />
            Start Debate
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
