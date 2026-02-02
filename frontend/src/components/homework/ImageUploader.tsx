/**
 * Image Uploader Component
 *
 * Multi-image upload with camera capture, gallery selection, and preview.
 * Used by both Homework Helper and Exam Prep modes.
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  createImagePreviews,
  revokeImagePreviews,
  validateImageFile,
} from '../../services/imageUploadService';

interface ImageUploaderProps {
  /** Maximum number of images allowed */
  maxImages: number;
  /** Minimum number of images required (for Exam Prep) */
  minImages?: number;
  /** Callback when images change */
  onImagesChange: (files: File[]) => void;
  /** Callback when upload starts */
  onUploadStart?: () => void;
  /** Currently selected files */
  files: File[];
  /** Is upload in progress */
  isUploading?: boolean;
  /** Upload progress (0-100) */
  progress?: number;
  /** Error message */
  error?: string;
}

export function ImageUploader({
  maxImages,
  minImages = 1,
  onImagesChange,
  files,
  isUploading = false,
  progress = 0,
  error,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        const validation = validateImageFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errors.push(validation.error || 'Invalid file');
        }
      }

      // Check max images
      const totalFiles = files.length + validFiles.length;
      if (totalFiles > maxImages) {
        setLocalError(`Maximum ${maxImages} images allowed`);
        return;
      }

      if (errors.length > 0) {
        setLocalError(errors[0]);
        return;
      }

      // Clear previous error
      setLocalError('');

      // Update files and previews
      const allFiles = [...files, ...validFiles];
      const newPreviews = createImagePreviews(validFiles);
      setPreviews((prev) => [...prev, ...newPreviews]);
      onImagesChange(allFiles);
    },
    [files, maxImages, onImagesChange]
  );

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // Reset input to allow selecting same file again
    e.target.value = '';
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const removedPreview = previews[index];
    const newPreviews = previews.filter((_, i) => i !== index);

    if (removedPreview) {
      revokeImagePreviews([removedPreview]);
    }

    setPreviews(newPreviews);
    onImagesChange(newFiles);
    setLocalError('');
  };

  // Open camera
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
      fileInputRef.current.removeAttribute('capture');
    }
  };

  // Open gallery
  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const canAddMore = files.length < maxImages && !isUploading;
  const meetsMinimum = files.length >= minImages;
  const displayError = error || localError;

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload Area */}
      {files.length === 0 ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors
            ${dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <div className="text-5xl mb-4">📸</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Add your homework photos
          </h3>
          <p className="text-gray-600 mb-4">
            Take a photo or choose from your gallery
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={openCamera}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>📷</span>
              Camera
            </button>
            <button
              onClick={openGallery}
              className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-2"
            >
              <span>🖼️</span>
              Gallery
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {minImages > 1
              ? `Upload ${minImages}-${maxImages} images`
              : `Upload up to ${maxImages} images`}
          </p>
        </div>
      ) : (
        <>
          {/* Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative aspect-[3/4] group">
                <img
                  src={previews[index] || URL.createObjectURL(file)}
                  alt={`Homework page ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
                />
                {!isUploading && (
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    ✕
                  </button>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                  Page {index + 1}
                </div>
              </div>
            ))}

            {/* Add More Button */}
            {canAddMore && (
              <button
                onClick={openGallery}
                className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <span className="text-3xl text-gray-400">+</span>
                <span className="text-sm text-gray-500 mt-1">Add more</span>
              </button>
            )}
          </div>

          {/* Image Count */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {files.length} of {maxImages} images
            </span>
            {!meetsMinimum && (
              <span className="text-amber-600">
                Minimum {minImages} images required
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={openCamera}
              disabled={!canAddMore}
              className="flex-1 py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📷 Take Photo
            </button>
            <button
              onClick={openGallery}
              disabled={!canAddMore}
              className="flex-1 py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🖼️ Add from Gallery
            </button>
          </div>
        </>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Uploading...</span>
            <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start">
          <span className="mr-2">⚠️</span>
          {displayError}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
