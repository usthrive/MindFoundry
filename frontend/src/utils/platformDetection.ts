/**
 * Platform Detection Utility
 *
 * Provides reliable detection of iOS, Android, and desktop platforms
 * to enable platform-specific behavior for focus management and input handling.
 */

export type Platform = 'ios' | 'android' | 'desktop'

/**
 * Detects the current platform based on user agent and device capabilities.
 *
 * @returns The detected platform: 'ios', 'android', or 'desktop'
 */
export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'desktop'

  const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || ''

  // iOS detection - iPhone, iPad, iPod
  if (/iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream) {
    return 'ios'
  }

  // iPad on iOS 13+ reports as Mac in user agent, detect via touch points
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return 'ios'
  }

  // Android detection
  if (/android/i.test(ua)) {
    return 'android'
  }

  return 'desktop'
}

/**
 * Returns the appropriate focus delay for the current platform.
 *
 * iOS requires longer delays due to strict focus rules and virtual keyboard timing.
 * Android needs moderate delays for reliable virtual keyboard appearance.
 * Desktop can use shorter delays as focus is more reliable.
 *
 * @returns Focus delay in milliseconds
 */
export function getFocusDelay(): number {
  const platform = detectPlatform()
  if (platform === 'ios') return 300
  if (platform === 'android') return 200
  return 100
}

/**
 * Checks if the current device is a mobile device (iOS or Android).
 *
 * @returns true if the device is mobile, false otherwise
 */
export function isMobileDevice(): boolean {
  const platform = detectPlatform()
  return platform === 'ios' || platform === 'android'
}
