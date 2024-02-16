import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import pkg from './package.json';

const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  esbuild: {
    loader: 'jsx',
    include: /\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  plugins: [
    react(),
    crx({
      manifest: {
        ...manifest,
        name: isDev ? `DEV: ${manifest.name}` : manifest.name,
        version: pkg.version,
      },
      contentScripts: {
        injectCss: true,
      },
    }),
  ],
  publicDir,
  build: {
    outDir,
    sourcemap: isDev,
    emptyOutDir: !isDev,
  },
});
