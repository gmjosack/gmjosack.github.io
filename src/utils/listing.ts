import { formatPrice } from './price';

/**
 * The one-liner for a listing: `summary` if it has one, otherwise the opening
 * of the body with the markdown stripped out. Used for the index cards and for
 * the meta description on the detail page, so both say the same thing.
 */
export function listingSummary(
  entry: { data: { summary?: string }; body?: string },
  maxLen = 180,
): string | undefined {
  if (entry.data.summary) return entry.data.summary;
  const plain = (entry.body || '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/^#+\s+.*$/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  if (!plain) return undefined;
  return truncate(plain, maxLen);
}

export function truncate(text: string, maxLen: number): string {
  return text.length > maxLen
    ? `${text.slice(0, maxLen).replace(/\s+\S*$/, '')}...`
    : text;
}

/** "$120 or best offer", or the note on its own when there's no price. */
export function priceText(item: { price?: number; priceNote?: string }): string {
  if (item.price == null) return item.priceNote || 'Make an offer';
  return item.priceNote
    ? `${formatPrice(item.price)} ${item.priceNote}`
    : formatPrice(item.price);
}
