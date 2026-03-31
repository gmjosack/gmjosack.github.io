import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    published: z.boolean().default(true),
    description: z.string().optional(),
    // Recommended: 1536x640px (2x retina, 2.4:1 aspect ratio)
    // Store in /public/images/posts/, reference as "/images/posts/filename.png"
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    // Vertical position for post list thumbnail crop (CSS object-position, default: "center")
    coverImagePosition: z.string().default("center"),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    seriesSubtitle: z.string().optional(),
  }),
});

export const collections = { posts };
