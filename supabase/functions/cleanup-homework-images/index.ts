/**
 * Cleanup Homework Images Edge Function
 *
 * Deletes expired homework images from Supabase Storage.
 * Should be triggered by pg_cron or Supabase scheduled functions.
 *
 * This function:
 * 1. Queries homework_images for records past their scheduled_deletion_at
 * 2. Deletes the files from Supabase Storage
 * 3. Deletes the database records
 * 4. Returns a summary of the cleanup
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CleanupResult {
  success: boolean
  imagesDeleted: number
  errors: string[]
  timestamp: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const result: CleanupResult = {
    success: true,
    imagesDeleted: 0,
    errors: [],
    timestamp: new Date().toISOString(),
  }

  try {
    // Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Query expired images
    const { data: expiredImages, error: queryError } = await supabase
      .from('homework_images')
      .select('id, storage_path, session_id')
      .lt('scheduled_deletion_at', new Date().toISOString())
      .limit(100) // Process in batches of 100

    if (queryError) {
      throw new Error(`Query failed: ${queryError.message}`)
    }

    if (!expiredImages || expiredImages.length === 0) {
      console.log('No expired images to clean up')
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${expiredImages.length} expired images to clean up`)

    // Group storage paths for batch deletion
    const storagePaths = expiredImages.map((img) => img.storage_path).filter(Boolean)
    const imageIds = expiredImages.map((img) => img.id)

    // Delete files from storage
    if (storagePaths.length > 0) {
      const { error: storageError } = await supabase
        .storage
        .from('homework-images')
        .remove(storagePaths)

      if (storageError) {
        // Log but continue - we still want to delete the DB records
        console.error('Storage deletion error:', storageError.message)
        result.errors.push(`Storage deletion: ${storageError.message}`)
      }
    }

    // Delete database records
    const { error: deleteError } = await supabase
      .from('homework_images')
      .delete()
      .in('id', imageIds)

    if (deleteError) {
      throw new Error(`Database deletion failed: ${deleteError.message}`)
    }

    result.imagesDeleted = expiredImages.length
    console.log(`Successfully cleaned up ${result.imagesDeleted} images`)

    // Log the cleanup for auditing
    await supabase
      .from('homework_ai_usage')
      .insert({
        child_id: null, // System operation
        feature: 'image_cleanup',
        model: 'system',
        input_tokens: 0,
        output_tokens: 0,
        estimated_cost: 0,
        metadata: {
          images_deleted: result.imagesDeleted,
          errors: result.errors,
        },
      })
      .catch((logError: Error) => {
        console.error('Failed to log cleanup:', logError.message)
      })

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Cleanup failed:', error)
    result.success = false
    result.errors.push(error.message || 'Unknown error')

    return new Response(
      JSON.stringify(result),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
