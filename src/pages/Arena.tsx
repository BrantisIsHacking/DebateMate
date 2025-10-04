"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DebateSetup } from "@/components/arena/debate-setup"
import { DebateInterface } from "@/components/arena/debate-interface"

export default function ArenaPage() {
  const [debateStarted, setDebateStarted] = useState(false)
  const [debateConfig, setDebateConfig] = useState<{
    topic: string
    opponent: string
    duration: number
  } | null>(null)

  const handleStartDebate = (config: { topic: string; opponent: string; duration: number }) => {
    setDebateConfig(config)
    setDebateStarted(true)
  }

  const handleEndDebate = () => {
    setDebateStarted(false)
    setDebateConfig(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {!debateStarted ? (
        <DebateSetup onStart={handleStartDebate} />
      ) : (
        <DebateInterface config={debateConfig!} onEnd={handleEndDebate} />
      )}
    </div>
  )
}
