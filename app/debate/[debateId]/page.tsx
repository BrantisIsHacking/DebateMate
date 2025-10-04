"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, AlertTriangle, CheckCircle, XCircle, Volume2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  fallacies?: Array<{
    type: string
    description: string
    severity: string
  }>
  scores?: {
    clarity: number
    evidence: number
    logic: number
    persuasiveness: number
    overall: number
  }
}

interface Debate {
  id: string
  topic: string
  position: string
  opponent_type: string
  status: string
}

export default function DebateArenaPage() {
  const router = useRouter()
  const params = useParams()
  const debateId = params.debateId as string

  const [debate, setDebate] = useState<Debate | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/auth/login")
      return
    }

    fetchDebate()
  }, [debateId, router])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchDebate = async () => {
    try {
      const response = await fetch(`/api/debates/get/${debateId}`)
      if (response.ok) {
        const data = await response.json()
        setDebate(data.debate)
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching debate:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage = currentMessage
    setCurrentMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/debates/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debateId,
          message: userMessage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      // Add user message and AI response to messages
      setMessages((prev) => [...prev, data.userMessage, data.aiMessage])
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpeak = async (text: string) => {
    setIsSpeaking(true)
    try {
      const response = await fetch("/api/speech/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: debate?.opponent_type }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.play()
        audio.onended = () => setIsSpeaking(false)
      }
    } catch (error) {
      console.error("[v0] Error synthesizing speech:", error)
      setIsSpeaking(false)
    }
  }

  const handleEndDebate = async () => {
    try {
      await fetch(`/api/debates/end/${debateId}`, { method: "POST" })
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error ending debate:", error)
    }
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading debate...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">DebateMate.Tech</span>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleEndDebate}>
              End Debate
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{debate.topic}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {debate.position}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                vs {debate.opponent_type}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Debate Arena - Split Screen */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Messages Area */}
        <Card className="flex-1 border-border bg-card flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Debate Arena</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            <ScrollArea ref={scrollRef} className="flex-1 px-6">
              <div className="space-y-4 pb-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Make your opening argument to begin the debate</p>
                  </div>
                )}
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold">
                          {message.role === "user" ? "You" : debate.opponent_type}
                        </span>
                        {message.role === "assistant" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleSpeak(message.content)}
                            disabled={isSpeaking}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                      {/* Fallacies */}
                      {message.fallacies && message.fallacies.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.fallacies.map((fallacy, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-xs bg-destructive/10 text-destructive p-2 rounded"
                            >
                              <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold">{fallacy.type}: </span>
                                <span>{fallacy.description}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Scores */}
                      {message.scores && (
                        <div className="mt-3 pt-3 border-t border-border/20">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Clarity:</span>
                              <span className="font-semibold">{message.scores.clarity}/100</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Evidence:</span>
                              <span className="font-semibold">{message.scores.evidence}/100</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Logic:</span>
                              <span className="font-semibold">{message.scores.logic}/100</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Persuasion:</span>
                              <span className="font-semibold">{message.scores.persuasiveness}/100</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-secondary-foreground rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex-shrink-0 p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your argument..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="min-h-[80px] bg-background border-border resize-none"
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isLoading} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Panel */}
        <Card className="lg:w-80 border-border bg-card flex-shrink-0">
          <CardHeader>
            <CardTitle className="text-lg">Live Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Debate Tips</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                  <span>Support claims with evidence</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                  <span>Address opponent's points directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                  <span>Avoid logical fallacies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                  <span>Stay focused on the topic</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Common Fallacies to Avoid</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Ad Hominem:</strong> Attacking the person
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Straw Man:</strong> Misrepresenting arguments
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>False Dichotomy:</strong> Only two options
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Appeal to Authority:</strong> Citing without evidence
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
