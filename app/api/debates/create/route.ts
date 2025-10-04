import { type NextRequest, NextResponse } from "next/server"
import { createDebate } from "@/lib/db-helpers"

export async function POST(request: NextRequest) {
  try {
    const { userId, topic, position, opponentType } = await request.json()

    if (!userId || !topic || !position || !opponentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const debate = await createDebate(userId, topic, position, opponentType)

    return NextResponse.json({ debate })
  } catch (error) {
    console.error("[v0] Create debate error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
