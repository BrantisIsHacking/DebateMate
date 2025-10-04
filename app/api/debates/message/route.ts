import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { getSnowflakeClient } from "@/lib/snowflake"
import { analyzeArgument, detectFallacies } from "@/lib/ai-helpers"

export async function POST(request: NextRequest) {
  try {
    const { debateId, message } = await request.json()

    if (!debateId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getSnowflakeClient()

    // Get debate details
    const debateResult = await db.query(`SELECT * FROM debates WHERE id = ?`, [debateId])
    if (debateResult.data.length === 0) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 })
    }
    const debate = debateResult.data[0]

    // Get conversation history
    const historyResult = await db.query(
      `SELECT role, content FROM debate_messages WHERE debate_id = ? ORDER BY created_at ASC`,
      [debateId],
    )
    const history = historyResult.data

    // Analyze user's argument for fallacies and score it
    const [fallacies, scores] = await Promise.all([detectFallacies(message), analyzeArgument(message)])

    // Save user message with analysis
    const userMessageId = crypto.randomUUID()
    await db.execute(
      `INSERT INTO debate_messages (id, debate_id, role, content, fallacies_detected, clarity_score, evidence_score, logic_score, persuasiveness_score, overall_score, created_at)
       VALUES (?, ?, 'user', ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())`,
      [
        userMessageId,
        debateId,
        message,
        JSON.stringify(fallacies),
        scores.clarity,
        scores.evidence,
        scores.logic,
        scores.persuasiveness,
        scores.overall,
      ],
    )

    // Generate AI opponent response
    const opponentPersona = getOpponentPersona(debate.opponent_type)
    const systemPrompt = `You are debating as a ${debate.opponent_type}. ${opponentPersona}

The debate topic is: "${debate.topic}"
You are arguing ${debate.position === "for" ? "AGAINST" : "FOR"} this statement.

Your arguing style should match your persona. Keep responses focused, persuasive, and around 150-200 words.
Address the opponent's points directly and present strong counterarguments.`

    const conversationHistory = history.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }))

    const { text: aiResponse } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...conversationHistory, { role: "user", content: message }],
      temperature: 0.8,
      maxTokens: 300,
    })

    // Save AI message
    const aiMessageId = crypto.randomUUID()
    await db.execute(
      `INSERT INTO debate_messages (id, debate_id, role, content, created_at)
       VALUES (?, ?, 'assistant', ?, CURRENT_TIMESTAMP())`,
      [aiMessageId, debateId, aiResponse],
    )

    // Update debate turn count
    await db.execute(`UPDATE debates SET turn_count = turn_count + 1 WHERE id = ?`, [debateId])

    return NextResponse.json({
      userMessage: {
        id: userMessageId,
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
        fallacies: fallacies,
        scores: scores,
      },
      aiMessage: {
        id: aiMessageId,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getOpponentPersona(opponentType: string): string {
  const personas: Record<string, string> = {
    politician:
      "You are diplomatic, persuasive, and skilled at appealing to emotions while maintaining credibility. You use rhetorical devices and focus on practical implications.",
    scientist:
      "You are analytical, data-driven, and methodical. You emphasize empirical evidence, studies, and logical reasoning. You question assumptions and demand proof.",
    activist:
      "You are passionate, values-driven, and emotionally compelling. You focus on moral imperatives, social justice, and the human impact of issues.",
    philosopher:
      "You are abstract, theoretical, and focused on fundamental principles. You explore underlying assumptions, ethical frameworks, and logical consistency.",
    journalist:
      "You are investigative, fact-focused, and skeptical. You ask probing questions, verify claims, and present multiple perspectives.",
    lawyer:
      "You are logical, precedent-based, and argumentative. You build cases systematically, cite evidence, and identify weaknesses in opposing arguments.",
  }
  return personas[opponentType] || personas.politician
}
