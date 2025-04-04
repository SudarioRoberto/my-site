import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel'; // ✅ current import

export default defineConfig({
  output: 'server', // Required for SSR
  adapter: vercel(),
  integrations: [tailwind()]
});