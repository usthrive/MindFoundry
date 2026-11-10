import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
const SRC = path.resolve(__dirname, '../../src');
const AUTH_STUB = path.resolve(__dirname, 'auth-stub.tsx');
export default defineConfig({
  root: __dirname,
  base: './',
  envDir: path.resolve(__dirname, '../..'),
  plugins: [react()],
  resolve: { alias: [
    { find: '@/lib/supabase', replacement: path.resolve(__dirname, 'supabase-stub.ts') },
    // A signed-in parent with one child (2026-11-10, screen=kumon-study / kumon-parent).
    // The other contexts import it as './AuthContext'.
    { find: '@/contexts/AuthContext', replacement: AUTH_STUB },
    { find: /^\.\/AuthContext$/, replacement: AUTH_STUB },
    { find: '@', replacement: SRC },
  ] },
  build: { outDir: process.env.HARNESS_OUT ?? path.resolve(__dirname, '../../../../.harness-dist'), emptyOutDir: true, sourcemap: false, minify: false, chunkSizeWarningLimit: 20000 },
});
