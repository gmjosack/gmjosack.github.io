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

const forSale = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/for-sale' }),
  schema: z.object({
    title: z.string(),
    // One-liner shown on the index card. Falls back to the first bit of the body.
    summary: z.string().optional(),
    // Freeform, e.g. "Open box, used twice" or "New, sealed".
    condition: z.string().optional(),
    price: z.number().optional(),
    // Stands in for the price when there isn't one (default "Make an offer"),
    // or tacks on beside it, e.g. "or best offer".
    priceNote: z.string().optional(),
    // Shown as a quiet "retails new for ..." line, not as a discount.
    retailPrice: z.number().optional(),
    // Where to see the item new. retailLabel names the store, e.g. "Amazon".
    retailUrl: z.string().optional(),
    retailLabel: z.string().optional(),
    // What the buyer actually gets, rendered as a plain list.
    includes: z.array(z.string()).default([]),
    // Gallery. Every image is zoomable; the first doubles as the index
    // thumbnail unless coverImage is set.
    images: z.array(z.object({
      src: z.string(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    })).default([]),
    coverImage: z.string().optional(),
    // Slugs of related listings, e.g. a second version of the same item.
    seeAlso: z.array(z.string()).default([]),
    seeAlsoNote: z.string().optional(),
    // Lower sorts first; unset sorts last.
    order: z.number().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { posts, forSale };
