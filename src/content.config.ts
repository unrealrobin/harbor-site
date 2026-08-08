import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Legal documents (terms, privacy). Authored as Markdown so the prose stays
// editable without touching markup — these get revised by hand, not by code.
// Rendered through src/layouts/Legal.astro.
const legal = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    entity: z.string(),
    version: z.string(),
    effectiveDate: z.coerce.date(),
    // Placeholder documents are noindexed so a holding page never gets
    // cached by search engines as though it were the real policy.
    noindex: z.boolean().default(false),
  }),
});

export const collections = { legal };
