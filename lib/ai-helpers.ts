import { GoogleGenAI } from '@google/genai';

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
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
const ai = new GoogleGenAI(API_KEY ? { apiKey: API_KEY } : {})

async function callGenAI(prompt: string, opts?: { temperature?: number; maxOutputTokens?: number }) {
  const temperature = opts?.temperature ?? 0.3
  const maxOutputTokens = opts?.maxOutputTokens ?? 600

  if (!API_KEY) {
    console.warn('[v0] No Gemini API key found in environment; calls may fail if the SDK requires a key')
  }

  const resp: any = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: { temperature, maxOutputTokens },
  })

  // Prefer .text helper, fallback to common fields
  let text = ''
  if (resp) {
    text = typeof resp.text === 'string' ? resp.text : ''
    text = text || resp?.output?.[0]?.content?.[0]?.text || resp?.candidates?.[0]?.text || ''
  }

  return text
}

function extractJsonLike(input: string): string | null {
  if (!input) return null
  // Try to find a JSON object or array in the string
  const objMatch = input.match(/\{[\s\S]*\}/m)
  const arrMatch = input.match(/\[[\s\S]*\]/m)
  if (objMatch) return objMatch[0]
  if (arrMatch) return arrMatch[0]
  return null
}

export async function analyzeArgument(argument: string): Promise<ArgumentScores> {
  try {
    const prompt = `Analyze this debate argument and score it on the following criteria (0-100 for each):

1. Clarity: How clear and well-structured is the argument?
2. Evidence: How well-supported is it with facts, data, or examples?
3. Logic: How logically sound and consistent is the reasoning?
4. Persuasiveness: How compelling and convincing is the overall argument?

Argument: "${argument}"

Respond ONLY with a JSON object in this exact format:
{"clarity": 75, "evidence": 60, "logic": 80, "persuasiveness": 70}
`

    let text = await callGenAI(prompt, { temperature: 0.3, maxOutputTokens: 200 })

    // Try parsing, but be robust to extra text
    let jsonStr = null
    try {
      jsonStr = text.trim()
      // If it doesn't start with {, try to extract JSON substring
      if (!jsonStr.startsWith('{')) {
        const extracted = extractJsonLike(jsonStr)
        if (extracted) jsonStr = extracted
      }
    } catch (e) {
      jsonStr = null
    }

    const scores = jsonStr ? JSON.parse(jsonStr) : { clarity: 50, evidence: 50, logic: 50, persuasiveness: 50 }
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
    const prompt = `Analyze this debate argument for logical fallacies. Identify any fallacies present.

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

Respond ONLY with valid JSON.`

    let text = await callGenAI(prompt, { temperature: 0.3, maxOutputTokens: 300 })

    // robust parse
    let jsonStr = null
    if (text) {
      jsonStr = text.trim()
      if (!jsonStr.startsWith('[')) {
        const extracted = extractJsonLike(jsonStr)
        if (extracted) jsonStr = extracted
      }
    }

    const fallacies = jsonStr ? JSON.parse(jsonStr) : []
    return Array.isArray(fallacies) ? fallacies : []
  } catch (error) {
    console.error("[v0] Error detecting fallacies:", error)
    return []
  }
}
