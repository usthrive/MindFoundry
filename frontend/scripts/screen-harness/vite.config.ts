import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
const SRC = path.resolve(__dirname, '../../src');
export default defineConfig({
  root: __dirname,
  base: './',
  envDir: path.resolve(__dirname, '../..'),
  plugins: [react()],
  resolve: { alias: [
    { find: '@/lib/supabase', replacement: path.resolve(__dirname, 'supabase-stub.ts') },
    { find: '@', replacement: SRC },
  ] },
  build: { outDir: process.env.HARNESS_OUT ?? path.resolve(__dirname, '../../../../.harness-dist'), emptyOutDir: true, sourcemap: false, minify: false, chunkSizeWarningLimit: 20000 },
});
