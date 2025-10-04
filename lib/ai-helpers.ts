import { generateText } from "ai"

export interface ArgumentScores {
  clarity: number
  evidence: number
  logic: number
  persuasiveness: number
  overall: number
}

export interface Fallacy {
  type: string
  description: string
  severity: "low" | "medium" | "high"
}

export async function analyzeArgument(argument: string): Promise<ArgumentScores> {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze this debate argument and score it on the following criteria (0-100 for each):

1. Clarity: How clear and well-structured is the argument?
2. Evidence: How well-supported is it with facts, data, or examples?
3. Logic: How logically sound and consistent is the reasoning?
4. Persuasiveness: How compelling and convincing is the overall argument?

Argument: "${argument}"

Respond ONLY with a JSON object in this exact format:
{"clarity": 75, "evidence": 60, "logic": 80, "persuasiveness": 70}`,
      temperature: 0.3,
    })

    const scores = JSON.parse(text.trim())
    const overall = Math.round((scores.clarity + scores.evidence + scores.logic + scores.persuasiveness) / 4)

    return {
      clarity: scores.clarity,
      evidence: scores.evidence,
      logic: scores.logic,
      persuasiveness: scores.persuasiveness,
      overall,
    }
  } catch (error) {
    console.error("[v0] Error analyzing argument:", error)
    // Return default scores on error
    return {
      clarity: 50,
      evidence: 50,
      logic: 50,
      persuasiveness: 50,
      overall: 50,
    }
  }
}

export async function detectFallacies(argument: string): Promise<Fallacy[]> {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze this debate argument for logical fallacies. Identify any fallacies present.

Common fallacies to check for:
- Ad Hominem (attacking the person)
- Straw Man (misrepresenting the argument)
- False Dichotomy (only two options presented)
- Appeal to Authority (citing authority without evidence)
- Slippery Slope (chain reaction without justification)
- Hasty Generalization (conclusion from insufficient evidence)
- Red Herring (irrelevant distraction)
- Circular Reasoning (conclusion assumes premise)
- Appeal to Emotion (manipulating emotions instead of logic)
- False Cause (incorrect causal relationship)

Argument: "${argument}"

If fallacies are found, respond with a JSON array like:
[{"type": "Ad Hominem", "description": "The argument attacks the person rather than addressing their point", "severity": "high"}]

If no fallacies are found, respond with an empty array: []

Respond ONLY with valid JSON.`,
      temperature: 0.3,
    })

    const fallacies = JSON.parse(text.trim())
    return Array.isArray(fallacies) ? fallacies : []
  } catch (error) {
    console.error("[v0] Error detecting fallacies:", error)
    return []
  }
}
