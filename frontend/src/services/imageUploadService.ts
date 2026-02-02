/**
 * Image Upload Service
 *
 * Handles uploading homework images to Supabase Storage
 * with automatic 24-hour deletion for privacy compliance.
 */

import { supabase } from '../lib/supabase';
import type { HomeworkImage } from '../types/homework';

/**
 * Storage bucket name for homework images
 */
const HOMEWORK_BUCKET = 'homework-images';

/**
 * Maximum image size in bytes (10MB)
 */
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed MIME types
 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/webp',
];

/**
 * Result of image upload operation
 */
export interface ImageUploadResult {
  success: boolean;
  image?: HomeworkImage;
  error?: string;
}

/**
 * Result of multiple image uploads
 */
export interface BatchUploadResult {
  success: boolean;
  images: HomeworkImage[];
  failed: Array<{ fileName: string; error: string }>;
  totalUploaded: number;
  totalFailed: number;
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" is too large. Maximum size is 10MB.`,
    };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File "${file.name}" is not a supported image type. Please use JPEG, PNG, or HEIC.`,
    };
  }

  return { valid: true };
}

/**
 * Compress image if needed
 * Returns a Blob (potentially compressed) that can be uploaded
 */
export async function compressImage(file: File, maxWidth = 2048): Promise<Blob> {
  // If image is small enough, don't compress
  if (file.size <= MAX_IMAGE_SIZE / 2) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        0.85
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate unique file path for storage
 */
function generateFilePath(sessionId: string, fileName: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split('.').pop() || 'jpg';
  return `sessions/${sessionId}/${timestamp}-${randomId}.${extension}`;
}

/**
 * Upload a single image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  sessionId: string
): Promise<ImageUploadResult> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    // Compress if needed
    const imageData = await compressImage(file);

    // Generate storage path
    const storagePath = generateFilePath(sessionId, file.name);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(HOMEWORK_BUCKET)
      .upload(storagePath, imageData, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return {
        success: false,
        error: `Failed to upload "${file.name}": ${uploadError.message}`,
      };
    }

    // Get signed URL (expires in 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(HOMEWORK_BUCKET)
      .createSignedUrl(storagePath, 3600);

    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError);
      // Continue without signed URL - can regenerate later
    }

    // Calculate expiration
    const signedUrlExpiresAt = signedUrlData
      ? new Date(Date.now() + 3600 * 1000).toISOString()
      : undefined;

    // Store record in database
    const { data: imageRecord, error: dbError } = await supabase
      .from('homework_images')
      .insert({
        session_id: sessionId,
        storage_path: storagePath,
        file_name: file.name,
        file_size_bytes: imageData.size,
        mime_type: file.type,
        signed_url: signedUrlData?.signedUrl,
        signed_url_expires_at: signedUrlExpiresAt,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Try to clean up the uploaded file
      await supabase.storage.from(HOMEWORK_BUCKET).remove([storagePath]);
      return {
        success: false,
        error: `Failed to save image record: ${dbError.message}`,
      };
    }

    return {
      success: true,
      image: imageRecord as HomeworkImage,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    };
  }
}

/**
 * Upload multiple images in batch
 */
export async function uploadImages(
  files: File[],
  sessionId: string,
  onProgress?: (completed: number, total: number) => void
): Promise<BatchUploadResult> {
  const images: HomeworkImage[] = [];
  const failed: Array<{ fileName: string; error: string }> = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await uploadImage(file, sessionId);

    if (result.success && result.image) {
      images.push(result.image);
    } else {
      failed.push({
        fileName: file.name,
        error: result.error || 'Unknown error',
      });
    }

    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  return {
    success: failed.length === 0,
    images,
    failed,
    totalUploaded: images.length,
    totalFailed: failed.length,
  };
}

/**
 * Get fresh signed URL for an image
 */
export async function refreshSignedUrl(
  imageId: string
): Promise<{ signedUrl?: string; error?: string }> {
  // Get the image record
  const { data: image, error: fetchError } = await supabase
    .from('homework_images')
    .select('storage_path')
    .eq('id', imageId)
    .single();

  if (fetchError || !image) {
    return { error: 'Image not found' };
  }

  // Get new signed URL
  const { data, error } = await supabase.storage
    .from(HOMEWORK_BUCKET)
    .createSignedUrl(image.storage_path, 3600);

  if (error) {
    return { error: error.message };
  }

  // Update the record
  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
  await supabase
    .from('homework_images')
    .update({
      signed_url: data.signedUrl,
      signed_url_expires_at: expiresAt,
    })
    .eq('id', imageId);

  return { signedUrl: data.signedUrl };
}

/**
 * Get signed URLs for multiple images
 */
export async function getSignedUrls(
  imageIds: string[]
): Promise<Record<string, string>> {
  const urls: Record<string, string> = {};

  // Get all image records
  const { data: images, error } = await supabase
    .from('homework_images')
    .select('id, storage_path, signed_url, signed_url_expires_at')
    .in('id', imageIds);

  if (error || !images) {
    return urls;
  }

  for (const image of images) {
    // Check if existing URL is still valid (with 5 minute buffer)
    if (image.signed_url && image.signed_url_expires_at) {
      const expiresAt = new Date(image.signed_url_expires_at);
      if (expiresAt.getTime() > Date.now() + 5 * 60 * 1000) {
        urls[image.id] = image.signed_url;
        continue;
      }
    }

    // Get fresh URL
    const result = await refreshSignedUrl(image.id);
    if (result.signedUrl) {
      urls[image.id] = result.signedUrl;
    }
  }

  return urls;
}

/**
 * Delete a single image
 */
export async function deleteImage(imageId: string): Promise<{ success: boolean; error?: string }> {
  // Get the image record
  const { data: image, error: fetchError } = await supabase
    .from('homework_images')
    .select('storage_path')
    .eq('id', imageId)
    .single();

  if (fetchError || !image) {
    return { success: false, error: 'Image not found' };
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(HOMEWORK_BUCKET)
    .remove([image.storage_path]);

  if (storageError) {
    console.error('Storage delete error:', storageError);
    // Continue to mark as deleted in DB
  }

  // Mark as deleted in database
  const { error: dbError } = await supabase
    .from('homework_images')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', imageId);

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  return { success: true };
}

/**
 * Delete all images for a session
 */
export async function deleteSessionImages(
  sessionId: string
): Promise<{ success: boolean; deleted: number; error?: string }> {
  // Get all image paths for the session
  const { data: images, error: fetchError } = await supabase
    .from('homework_images')
    .select('id, storage_path')
    .eq('session_id', sessionId)
    .is('deleted_at', null);

  if (fetchError) {
    return { success: false, deleted: 0, error: fetchError.message };
  }

  if (!images || images.length === 0) {
    return { success: true, deleted: 0 };
  }

  // Delete from storage
  const paths = images.map((img) => img.storage_path);
  const { error: storageError } = await supabase.storage
    .from(HOMEWORK_BUCKET)
    .remove(paths);

  if (storageError) {
    console.error('Storage delete error:', storageError);
    // Continue to mark as deleted in DB
  }

  // Mark as deleted in database
  const ids = images.map((img) => img.id);
  const { error: dbError } = await supabase
    .from('homework_images')
    .update({ deleted_at: new Date().toISOString() })
    .in('id', ids);

  if (dbError) {
    return { success: false, deleted: 0, error: dbError.message };
  }

  return { success: true, deleted: images.length };
}

/**
 * Get images for a session
 */
export async function getSessionImages(
  sessionId: string
): Promise<HomeworkImage[]> {
  const { data, error } = await supabase
    .from('homework_images')
    .select('*')
    .eq('session_id', sessionId)
    .is('deleted_at', null)
    .order('uploaded_at', { ascending: true });

  if (error) {
    console.error('Error fetching session images:', error);
    return [];
  }

  return (data || []) as HomeworkImage[];
}

/**
 * Create preview URLs for local files (before upload)
 */
export function createImagePreviews(files: File[]): string[] {
  return files.map((file) => URL.createObjectURL(file));
}

/**
 * Revoke preview URLs to free memory
 */
export function revokeImagePreviews(urls: string[]): void {
  urls.forEach((url) => URL.revokeObjectURL(url));
}

/**
 * Check if storage bucket exists (for setup verification)
 */
export async function checkStorageBucketExists(): Promise<boolean> {
  const { data, error } = await supabase.storage.getBucket(HOMEWORK_BUCKET);
  return !error && !!data;
}

/**
 * Get total storage used by a child's homework images
 */
export async function getChildStorageUsage(childId: string): Promise<number> {
  const { data, error } = await supabase
    .from('homework_images')
    .select('file_size_bytes, homework_sessions!inner(child_id)')
    .eq('homework_sessions.child_id', childId)
    .is('deleted_at', null);

  if (error || !data) {
    return 0;
  }

  return data.reduce((sum, img) => sum + (img.file_size_bytes || 0), 0);
}
