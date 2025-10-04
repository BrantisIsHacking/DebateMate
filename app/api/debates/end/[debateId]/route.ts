import { type NextRequest, NextResponse } from "next/server"
import { getSnowflakeClient } from "@/lib/snowflake"

export async function POST(request: NextRequest, { params }: { params: Promise<{ debateId: string }> }) {
  try {
    const { debateId } = await params

    if (!debateId) {
      return NextResponse.json({ error: "Debate ID is required" }, { status: 400 })
    }

    const db = getSnowflakeClient()
    await db.execute(`UPDATE debates SET status = 'completed', completed_at = CURRENT_TIMESTAMP() WHERE id = ?`, [
      debateId,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] End debate error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
