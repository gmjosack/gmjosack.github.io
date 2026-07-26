// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://madebygare.com',
  trailingSlash: 'always',
  // /for-sale/ is an unlisted page: kept out of the sitemap here and marked
  // noindex in BaseHead. Deliberately not blocked in robots.txt, since a
  // Disallow would stop crawlers from ever reading the noindex.
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/for-sale') })],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'monokai',
    },
  },
});
