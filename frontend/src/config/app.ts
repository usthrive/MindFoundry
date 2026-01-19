/**
 * Centralized App Configuration
 * Update these values when changing domains or branding
 */

export const APP_CONFIG = {
  /** The public URL of the app - displayed on share cards */
  appUrl: 'mindfoundry.netlify.app',

  /** The app name - used in branding */
  appName: 'MindFoundry',

  /** Emoji used for branding */
  brandEmoji: '🧠',
} as const;

export type AppConfig = typeof APP_CONFIG;
