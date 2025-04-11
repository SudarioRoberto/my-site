import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ['nodemailer', 'bcryptjs'], // Add bcryptjs here
    },
  },
});