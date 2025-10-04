import { type NextRequest, NextResponse } from "next/server"
import { getSnowflakeClient } from "@/lib/snowflake"
import { getDebateMessages } from "@/lib/db-helpers"

export async function GET(request: NextRequest, { params }: { params: Promise<{ debateId: string }> }) {
  try {
    const { debateId } = await params

    if (!debateId) {
      return NextResponse.json({ error: "Debate ID is required" }, { status: 400 })
    }

    const db = getSnowflakeClient()
    const debateResult = await db.query(`SELECT * FROM debates WHERE id = ?`, [debateId])

    if (debateResult.data.length === 0) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 })
    }

    const messages = await getDebateMessages(debateId)

    // Handle Snowflake column case conversion for debate data
    const debate = debateResult.data[0]
    const formattedDebate = {
      id: debate.ID || debate.id,
      topic: debate.TOPIC || debate.topic,
      position: debate.POSITION || debate.position,
      opponent_type: debate.OPPONENT_TYPE || debate.opponent_type,
      status: debate.STATUS || debate.status,
      turn_count: debate.TURN_COUNT || debate.turn_count,
      created_at: debate.CREATED_AT || debate.created_at,
      completed_at: debate.COMPLETED_AT || debate.completed_at,
    }

    return NextResponse.json({
      debate: formattedDebate,
      messages,
    })
  } catch (error) {
    console.error("[v0] Get debate error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
