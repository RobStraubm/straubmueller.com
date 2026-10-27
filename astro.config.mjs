// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://straubmueller.com',
  // Preact draws the film scenes of motion/src live on the case pages of version J; 'remotion' resolves to a
  // small stand-in, so the scenes run without the video toolchain.
  integrations: [preact({ compat: true })],
  vite: {
    resolve: {
      alias: { remotion: fileURLToPath(new URL('./src/scripts/remotion-shim.ts', import.meta.url)) },
    },
  },
});
