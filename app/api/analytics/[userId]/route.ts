import { type NextRequest, NextResponse } from "next/server"
import { getUserAnalytics } from "@/lib/db-helpers"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get analytics for the last 30 days
    const analytics = await getUserAnalytics(userId, 30)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("[v0] Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
