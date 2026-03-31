import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts'))
    .filter(p => p.data.published)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'Made By Gare',
    description: 'Posts from Made By Gare',
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.seriesSubtitle
        ? `${post.data.title} - ${post.data.seriesSubtitle}`
        : post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description || '',
      link: `/posts/${post.id}/`,
    })),
  });
}
