/**
 * Generate Speech Edge Function
 *
 * Converts text to speech using OpenAI TTS API (gpt-4o-mini-tts).
 * Returns audio as base64-encoded MP3 data.
 *
 * This function keeps the OpenAI API key secure on the server side.
 * Auth: verify_jwt = false (gateway passes all requests), manual JWT
 * validation inside function (same pattern as ai-service).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TTSRequest {
  text: string
  voice?: string
  speed?: number
  instructions?: string
}

interface TTSResponse {
  success: boolean
  audioContent?: string  // Base64 encoded audio
  error?: string
  audioFormat?: string
}

// Default voice configuration for Ms. Guide (child-friendly female voice)
const DEFAULT_VOICE = 'nova'
const DEFAULT_SPEED = 0.9  // Slightly slower for clarity
const DEFAULT_INSTRUCTIONS = 'Speak in a warm, encouraging, slightly playful tone for a young child learning math. Be clear and enunciate well.'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openaiApiKey) {
      console.error('OpenAI API key not configured')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'TTS service not configured',
        } as TTSResponse),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Manual JWT validation (verify_jwt = false at gateway, validated here)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization' } as TTSResponse),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      console.error('Auth failed:', authError?.message)
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' } as TTSResponse),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`TTS request from user: ${user.id}`)

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

    // Limit text length to prevent abuse (OpenAI TTS has a 4096 char limit)
    const maxLength = 4000  // Leave some buffer
    let text = body.text.trim()
    if (text.length > maxLength) {
      text = text.substring(0, maxLength)
      console.warn(`Text truncated from ${body.text.length} to ${maxLength} characters`)
    }

    const voice = body.voice || DEFAULT_VOICE
    const speed = body.speed ?? DEFAULT_SPEED
    const instructions = body.instructions || DEFAULT_INSTRUCTIONS

    console.log(`Generating speech for ${text.length} characters with voice ${voice}`)

    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        input: text,
        voice,
        speed,
        response_format: 'mp3',
        instructions,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI TTS API error:', response.status, errorText)

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

    // OpenAI returns binary MP3 — convert to base64 for JSON response
    const arrayBuffer = await response.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)

    // Encode to base64 in chunks to avoid stack overflow on large audio
    let base64Audio = ''
    const chunkSize = 8192
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize)
      base64Audio += String.fromCharCode(...chunk)
    }
    base64Audio = btoa(base64Audio)

    console.log('Speech generated successfully')

    return new Response(
      JSON.stringify({
        success: true,
        audioContent: base64Audio,
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
