import { type NextRequest, NextResponse } from "next/server"
import { getUserDebates } from "@/lib/db-helpers"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const debates = await getUserDebates(userId)

    return NextResponse.json({ debates })
  } catch (error) {
    console.error("[v0] Debates fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
