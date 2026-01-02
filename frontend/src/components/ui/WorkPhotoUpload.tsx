import { useRef, useState, useEffect, useCallback } from 'react'

interface WorkPhoto {
  id: string
  file: File
  previewUrl: string
  compressedBlob?: Blob
}

interface WorkPhotoUploadProps {
  photos?: WorkPhoto[]
  onPhotosChange?: (photos: WorkPhoto[]) => void
  maxPhotos?: number
  disabled?: boolean
  className?: string
  // Future tier-gating props (prepared but not implemented yet)
  hasVisualRecognition?: boolean
  onSave?: (photos: WorkPhoto[]) => Promise<void>
  storageEnabled?: boolean
}

const MAX_DIMENSION = 1200
const COMPRESSION_QUALITY = 0.75
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp']

function generateId(): string {
  return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

async function compressImage(
  file: File,
  maxDimension: number = MAX_DIMENSION,
  quality: number = COMPRESSION_QUALITY
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    img.onload = () => {
      let { width, height } = img

      // Scale down if larger than max dimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension
          width = maxDimension
        } else {
          width = (width / height) * maxDimension
          height = maxDimension
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw image to canvas
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Could not compress image'))
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Could not load image'))
    }

    // Create object URL for the file
    img.src = URL.createObjectURL(file)
  })
}

export default function WorkPhotoUpload({
  photos: initialPhotos = [],
  onPhotosChange,
  maxPhotos = 2,
  disabled = false,
  className = '',
}: WorkPhotoUploadProps) {
  const [photos, setPhotos] = useState<WorkPhoto[]>(initialPhotos)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        URL.revokeObjectURL(photo.previewUrl)
      })
    }
  }, [])

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      setError(null)
      setIsCompressing(true)

      try {
        const newPhotos: WorkPhoto[] = []

        for (let i = 0; i < files.length; i++) {
          if (photos.length + newPhotos.length >= maxPhotos) {
            setError(`Maximum ${maxPhotos} photos allowed`)
            break
          }

          const file = files[i]

          // Validate file type
          if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Please upload JPEG, PNG, or HEIC images only')
            continue
          }

          // Compress image
          const compressedBlob = await compressImage(file)
          const previewUrl = URL.createObjectURL(compressedBlob)

          newPhotos.push({
            id: generateId(),
            file,
            previewUrl,
            compressedBlob,
          })
        }

        if (newPhotos.length > 0) {
          const updatedPhotos = [...photos, ...newPhotos]
          setPhotos(updatedPhotos)
          onPhotosChange?.(updatedPhotos)
        }
      } catch (err) {
        setError('Failed to process image. Please try again.')
        console.error('Image compression error:', err)
      } finally {
        setIsCompressing(false)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [photos, maxPhotos, onPhotosChange]
  )

  const handleRemovePhoto = useCallback(
    (photoId: string) => {
      const photoToRemove = photos.find((p) => p.id === photoId)
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.previewUrl)
      }

      const updatedPhotos = photos.filter((p) => p.id !== photoId)
      setPhotos(updatedPhotos)
      onPhotosChange?.(updatedPhotos)
      setError(null)
    },
    [photos, onPhotosChange]
  )

  const handleAddClick = () => {
    fileInputRef.current?.click()
  }

  const canAddMore = photos.length < maxPhotos && !disabled

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        disabled={disabled || isCompressing}
        className="hidden"
        multiple={maxPhotos > 1}
      />

      {/* Photo grid */}
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100"
          >
            <img
              src={photo.previewUrl}
              alt={`Work photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-colors"
                aria-label={`Remove photo ${index + 1}`}
              >
                ×
              </button>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">
              {photo.compressedBlob
                ? `${Math.round(photo.compressedBlob.size / 1024)} KB`
                : '...'}
            </div>
          </div>
        ))}

        {/* Add photo button */}
        {canAddMore && (
          <button
            onClick={handleAddClick}
            disabled={isCompressing}
            className={`
              w-28 h-28 rounded-lg border-2 border-dashed
              flex flex-col items-center justify-center gap-1
              transition-colors
              ${
                isCompressing
                  ? 'border-gray-300 bg-gray-100 cursor-wait'
                  : 'border-purple-400 hover:border-purple-500 hover:bg-purple-50 cursor-pointer'
              }
            `}
          >
            {isCompressing ? (
              <>
                <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-500">Processing...</span>
              </>
            ) : (
              <>
                <span className="text-3xl text-purple-500">📷</span>
                <span className="text-xs text-purple-600 font-medium">Add Photo</span>
                <span className="text-xs text-gray-400">
                  {photos.length}/{maxPhotos}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      {/* Help text */}
      <p className="text-xs text-gray-500 text-center">
        {photos.length === 0
          ? 'Take a photo of your work or select from gallery'
          : photos.length < maxPhotos
          ? `Add up to ${maxPhotos - photos.length} more photo${maxPhotos - photos.length > 1 ? 's' : ''}`
          : 'Maximum photos reached'}
      </p>

      {/* Compression info */}
      {photos.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          Images are compressed to save storage (max {MAX_DIMENSION}px)
        </p>
      )}
    </div>
  )
}

export { type WorkPhoto, type WorkPhotoUploadProps, compressImage }
