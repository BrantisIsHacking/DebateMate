import { type NextRequest, NextResponse } from "next/server"
import { getSnowflakeClient } from "@/lib/snowflake"
import { getDebateMessages } from "@/lib/db-helpers"

export async function GET(request: NextRequest, { params }: { params: { debateId: string } }) {
  try {
    const { debateId } = params

    if (!debateId) {
      return NextResponse.json({ error: "Debate ID is required" }, { status: 400 })
    }

    const db = getSnowflakeClient()
    const debateResult = await db.query(`SELECT * FROM debates WHERE id = ?`, [debateId])

    if (debateResult.data.length === 0) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 })
    }

    const messages = await getDebateMessages(debateId)

    return NextResponse.json({
      debate: debateResult.data[0],
      messages,
    })
  } catch (error) {
    console.error("[v0] Get debate error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
