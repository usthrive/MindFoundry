/**
 * Generate Speech Edge Function
 *
 * Converts text to speech using Google Cloud TTS API.
 * Returns audio as base64-encoded data.
 *
 * This function keeps the Google Cloud API key secure on the server side.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TTSRequest {
  text: string
  voice?: string
  speakingRate?: number
  pitch?: number
  languageCode?: string
}

interface TTSResponse {
  success: boolean
  audioContent?: string  // Base64 encoded audio
  error?: string
  audioFormat?: string
}

// Default voice configuration for Ms. Guide (child-friendly female voice)
const DEFAULT_VOICE = 'en-US-Neural2-C'
const DEFAULT_SPEAKING_RATE = 0.9  // Slightly slower for clarity
const DEFAULT_PITCH = 0  // Neutral pitch
const DEFAULT_LANGUAGE = 'en-US'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const googleApiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY')

    if (!googleApiKey) {
      console.error('Google Cloud API key not configured')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'TTS service not configured',
        } as TTSResponse),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: TTSRequest = await req.json()

    if (!body.text || body.text.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Text is required',
        } as TTSResponse),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Limit text length to prevent abuse (Google TTS has a 5000 byte limit per request)
    const maxLength = 4500  // Leave some buffer
    let text = body.text.trim()
    if (text.length > maxLength) {
      text = text.substring(0, maxLength)
      console.warn(`Text truncated from ${body.text.length} to ${maxLength} characters`)
    }

    // Build Google Cloud TTS request
    const ttsRequest = {
      input: {
        text: text,
      },
      voice: {
        languageCode: body.languageCode || DEFAULT_LANGUAGE,
        name: body.voice || DEFAULT_VOICE,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: body.speakingRate ?? DEFAULT_SPEAKING_RATE,
        pitch: body.pitch ?? DEFAULT_PITCH,
        // Enable effects for warmer, more natural sound
        effectsProfileId: ['headphone-class-device'],
      },
    }

    console.log(`Generating speech for ${text.length} characters with voice ${ttsRequest.voice.name}`)

    // Call Google Cloud TTS API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ttsRequest),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google TTS API error:', response.status, errorText)

      // Parse error for better message
      let errorMessage = 'Failed to generate speech'
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.error?.message) {
          errorMessage = errorData.error.message
        }
      } catch {
        // Use default error message
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage,
        } as TTSResponse),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()

    if (!data.audioContent) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No audio content returned',
        } as TTSResponse),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Speech generated successfully')

    return new Response(
      JSON.stringify({
        success: true,
        audioContent: data.audioContent,
        audioFormat: 'mp3',
      } as TTSResponse),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Generate speech error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to generate speech',
      } as TTSResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
