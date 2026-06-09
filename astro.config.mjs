// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://harborlauncher.com',
  integrations: [
    starlight({
      title: 'Harbor Docs',
      description: 'Documentation for Harbor — the white-label launcher for indie game studios.',
      // Use our own marketing-branded 404 (src/pages/404.astro) site-wide instead
      // of Starlight's docs-styled one, which otherwise collides on the /404 route.
      disable404Route: true,
      customCss: ['./src/styles/starlight-harbor.css'],
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500;600&display=swap',
          },
        },
      ],
      sidebar: [
        { label: '← harborlauncher.com', link: '/' },
        {
          label: 'Getting Started',
          items: [
            { label: 'Welcome', slug: 'docs/welcome' },
            { label: 'Quickstart', slug: 'docs/quickstart' },
            { label: 'Customization & Content', slug: 'docs/customization' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'CLI menu', slug: 'docs/reference/cli-menu' },
            { label: 'harbor.config.json', slug: 'docs/reference/config' },
            { label: 'Modules', slug: 'docs/reference/modules' },
          ],
        },
        {
          label: 'Program',
          items: [{ label: 'Early adopter terms', slug: 'docs/program/early-adopter' }],
        },
      ],
    }),
  ],
});
