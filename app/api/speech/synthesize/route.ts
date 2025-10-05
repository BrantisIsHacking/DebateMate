import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, voice, useFallback } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Map opponent types to voice characteristics
    const voiceMap: Record<string, string> = {
      politician: "professional",
      scientist: "analytical",
      activist: "passionate",
      philosopher: "thoughtful",
      journalist: "clear",
      lawyer: "authoritative",
    }

    const voiceStyle = voiceMap[voice] || "professional"

    // If fallback is requested or API keys are missing, return browser TTS instructions
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
    const VOICE_ID = process.env.ELEVENLABS_VOICE_ID

    if (useFallback || !ELEVENLABS_API_KEY || !VOICE_ID) {
      return NextResponse.json({ 
        useBrowserTTS: true, 
        voiceStyle,
        text 
      })
    }

    try {
      // Set a timeout for the ElevenLabs request (5 seconds)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY as string
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5', // Faster model
            voice_settings: {
              stability: 0.6,
              similarity_boost: 0.8,
              style: 0.3,
              use_speaker_boost: true
            }
          }),
          signal: controller.signal
        }
      )
      
      clearTimeout(timeout)
      
      if (!response.ok) {
        console.error('ElevenLabs API error:', response.status, response.statusText)
        // Fallback to browser TTS
        return NextResponse.json({ 
          useBrowserTTS: true, 
          voiceStyle,
          text 
        })
      }
      
      const audioBuffer = await response.arrayBuffer()
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      })
    } catch (error) {
      console.error('ElevenLabs timeout or error, falling back to browser TTS:', error)
      // Fallback to browser TTS
      return NextResponse.json({ 
        useBrowserTTS: true, 
        voiceStyle,
        text 
      })
    }
  } catch (error) {
    console.error("[v0] Speech synthesis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
