import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'MindFoundry - Math Practice for Kids',
        short_name: 'MindFoundry',
        description: 'A fun math practice app for children ages 4-11',
        theme_color: '#F97316',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['education', 'kids'],
        icons: [
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Back to the 2 MiB default. It was raised to 4 MiB as a stopgap when the
        // shell first crossed it, and the shell then quietly grew to 4.44 MB and
        // broke the build anyway — a raised ceiling only hides the next breach.
        // With content split per level and behind /foundry, nothing comes close,
        // so the default is once again a working tripwire rather than a formality.
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        // Cache strategies for the PWA
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true // Enable PWA in development for testing
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split heavy vendor code into separate chunks so the initial app shell
    // is small and the rest loads on demand. Cuts first-paint JS roughly
    // in half (we were shipping 2.1 MB as a single chunk).
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Authored week content, split by level. One chunk held every level's
          // weeks and had grown to 2.9 MB on its way to the precache ceiling the
          // app shell just hit — the corpus is 107 of 120 cells with the ladder
          // planned far beyond that, so a single content chunk is a deadline, not
          // a design. Per level, each stays small and finishing a level cannot
          // push any other chunk over.
          const week = id.match(/best-brains\/generator\/templates\/weeks\/([a-z])\d+/)
          if (week) return `bb-content-${week[1]}`

          if (!id.includes('node_modules')) return undefined
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react'
          if (id.includes('@supabase')) return 'vendor-supabase'
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('katex')) return 'vendor-katex'
          if (id.includes('@anthropic-ai') || id.includes('openai')) return 'vendor-ai'
          if (id.includes('@stripe')) return 'vendor-stripe'
          return 'vendor-misc'
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  server: {
    watch: {
      // Use polling for WSL compatibility - prevents ERR_CONNECTION_RESET crashes
      usePolling: true,
      interval: 1000,
    },
  },
})
