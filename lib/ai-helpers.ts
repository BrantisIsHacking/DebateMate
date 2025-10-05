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

if (!API_KEY && typeof window === 'undefined') {
  console.log(`
🤖 AI Features Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  No Gemini API key found - using fallback analysis mode
📝 To enable full AI features, set up your API key:
   1. Get a key from: https://aistudio.google.com/app/apikey
   2. Add to .env.local: GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   3. Restart the development server

💡 See GEMINI_SETUP.md for detailed instructions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
}

const ai = new GoogleGenAI(API_KEY ? { apiKey: API_KEY } : {})

async function callGenAI(prompt: string, opts?: { temperature?: number; maxOutputTokens?: number }) {
  const temperature = opts?.temperature ?? 0.3
  const maxOutputTokens = opts?.maxOutputTokens ?? 600

  if (!API_KEY) {
    throw new Error('No Gemini API key configured')
  }

  try {
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
  } catch (error) {
    console.error('[AI] Gemini API call failed:', error)
    throw error
  }
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

// Fallback analysis when AI is not available
function analyzeArgumentFallback(argument: string): ArgumentScores {
  console.log(`[AI Fallback] Analyzing: "${argument.substring(0, 50)}..."`)
  
  const text = argument.toLowerCase()
  const wordCount = argument.split(/\s+/).length
  
  console.log(`[AI Fallback] Word count: ${wordCount}`)
  
  // Basic heuristic analysis
  let clarity = 50
  let evidence = 50
  let logic = 50
  let persuasiveness = 50
  
  // Clarity factors
  if (wordCount > 10) clarity += 10
  if (wordCount > 30) clarity += 10
  if (wordCount > 50) clarity += 5
  if (argument.includes('.') || argument.includes('!') || argument.includes('?')) clarity += 5
  if (/\b(first|second|third|finally|therefore|however|moreover)\b/.test(text)) clarity += 10
  
  // Evidence factors
  if (/\b(study|research|data|statistics|evidence|according to|study shows)\b/.test(text)) evidence += 20
  if (/\b(percent|%|\d+)\b/.test(text)) evidence += 15
  if (/\b(example|instance|case|specifically)\b/.test(text)) evidence += 10
  if (/\b(source|study|report|survey)\b/.test(text)) evidence += 10
  
  // Logic factors
  if (/\b(because|therefore|thus|consequently|as a result|due to)\b/.test(text)) logic += 15
  if (/\b(if|then|when|while|although|however)\b/.test(text)) logic += 10
  if (/\b(cause|effect|reason|factor)\b/.test(text)) logic += 10
  if (wordCount > 20) logic += 5
  
  // Persuasiveness factors
  if (/\b(should|must|need to|important|critical|essential)\b/.test(text)) persuasiveness += 10
  if (/\b(clearly|obviously|certainly|undoubtedly)\b/.test(text)) persuasiveness += 5
  if (/\b(benefit|advantage|improve|better|solution)\b/.test(text)) persuasiveness += 10
  if (/\b(problem|issue|concern|challenge)\b/.test(text)) persuasiveness += 5
  if (wordCount > 25) persuasiveness += 10
  
  // Cap at 100
  clarity = Math.min(100, clarity)
  evidence = Math.min(100, evidence)
  logic = Math.min(100, logic)
  persuasiveness = Math.min(100, persuasiveness)  // FIXED: was using logic instead of persuasiveness
  
  const overall = Math.round((clarity + evidence + logic + persuasiveness) / 4)
  
  const result = { clarity, evidence, logic, persuasiveness, overall }
  console.log(`[AI Fallback] Calculated scores:`, result)
  
  return result
}

export async function analyzeArgument(argument: string): Promise<ArgumentScores> {
  console.log(`[AI] Analyzing argument: "${argument.substring(0, 100)}..."`)
  
  try {
    // Check if API key is available
    if (!API_KEY) {
      console.log('[AI] No Gemini API key found. Using fallback analysis.')
      const fallbackResult = analyzeArgumentFallback(argument)
      console.log('[AI] Fallback result:', fallbackResult)
      return fallbackResult
    }

    console.log('[AI] Using Gemini AI for analysis')
    const prompt = `You are an expert debate analyst. Analyze this debate argument and provide scores from 0-100 for each criteria.

Argument to analyze: "${argument}"

Scoring criteria:
1. Clarity (0-100): How clear, well-structured, and easy to understand is the argument?
2. Evidence (0-100): How well-supported is it with facts, data, examples, or credible sources?
3. Logic (0-100): How logically sound and consistent is the reasoning? Are there logical connections?
4. Persuasiveness (0-100): How compelling and convincing is the overall argument?

Consider these factors:
- Length and depth of the argument
- Use of specific examples or data
- Logical flow and structure
- Potential counterarguments addressed
- Language effectiveness

Respond ONLY with a JSON object in this exact format (no additional text):
{"clarity": [score], "evidence": [score], "logic": [score], "persuasiveness": [score]}

Example format: {"clarity": 85, "evidence": 70, "logic": 90, "persuasiveness": 75}`

    let text = await callGenAI(prompt, { temperature: 0.2, maxOutputTokens: 300 })
    console.log('[AI] Gemini response:', text)

    // Try parsing, but be robust to extra text
    let jsonStr = null
    let scores = null
    
    try {
      jsonStr = text.trim()
      // If it doesn't start with {, try to extract JSON substring
      if (!jsonStr.startsWith('{')) {
        const extracted = extractJsonLike(jsonStr)
        if (extracted) jsonStr = extracted
      }
      
      if (jsonStr) {
        scores = JSON.parse(jsonStr)
        console.log('[AI] Parsed scores from Gemini:', scores)
        
        // Validate that all required fields are present and are numbers
        if (typeof scores.clarity !== 'number' || 
            typeof scores.evidence !== 'number' || 
            typeof scores.logic !== 'number' || 
            typeof scores.persuasiveness !== 'number') {
          throw new Error('Invalid score format')
        }
        
        // Clamp scores to 0-100 range
        scores.clarity = Math.max(0, Math.min(100, Math.round(scores.clarity)))
        scores.evidence = Math.max(0, Math.min(100, Math.round(scores.evidence)))
        scores.logic = Math.max(0, Math.min(100, Math.round(scores.logic)))
        scores.persuasiveness = Math.max(0, Math.min(100, Math.round(scores.persuasiveness)))
      }
    } catch (e) {
      console.warn('[AI] Failed to parse Gemini response, using fallback analysis:', e)
      const fallbackResult = analyzeArgumentFallback(argument)
      console.log('[AI] Fallback result after parse error:', fallbackResult)
      return fallbackResult
    }

    if (!scores) {
      console.warn('[AI] No valid scores from Gemini, using fallback analysis')
      const fallbackResult = analyzeArgumentFallback(argument)
      console.log('[AI] Fallback result after no scores:', fallbackResult)
      return fallbackResult
    }

    const overall = Math.round((scores.clarity + scores.evidence + scores.logic + scores.persuasiveness) / 4)

    const finalResult = {
      clarity: scores.clarity,
      evidence: scores.evidence,
      logic: scores.logic,
      persuasiveness: scores.persuasiveness,
      overall,
    }
    
    console.log('[AI] Final Gemini result:', finalResult)
    return finalResult
  } catch (error) {
    console.error("[AI] Error analyzing argument:", error)
    // Return fallback analysis on error
    const fallbackResult = analyzeArgumentFallback(argument)
    console.log('[AI] Fallback result after error:', fallbackResult)
    return fallbackResult
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
