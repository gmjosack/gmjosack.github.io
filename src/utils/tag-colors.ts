// Builds a color map by evenly distributing hues around the color wheel.
// Colors are consistent for a given set of tags but may shift when tags are added/removed.
export function buildTagColors(tags: string[]): Map<string, string> {
  const sorted = [...tags].sort();
  const map = new Map<string, string>();
  for (let i = 0; i < sorted.length; i++) {
    const hue = Math.round((360 * i) / sorted.length);
    map.set(sorted[i], `${hue} 70%`);
  }
  return map;
}
