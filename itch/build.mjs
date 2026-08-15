/* Minifies profile.css into profile.min.css, which is what gets pasted
   into itch's custom CSS box.

   itch caps that box at 5120 characters, and the cap is the reason this
   script exists: the source is written to be read, and the paste is
   written to fit. Comments are free — they don't survive here — so
   documentation in the source costs nothing. Declarations are what count.

   Run: node itch/build.mjs */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { transform } from 'lightningcss';

const LIMIT = 5120;
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'profile.css');
const out = join(here, 'profile.min.css');

/* Safari 15.4 is the floor: it's the oldest engine with :focus-visible,
   `inset`-style color hexes and the gradient shorthands used here. Aiming
   lower makes lightningcss add fallbacks, which spends the budget on
   browsers that can't render the page anyway. */
const targets = { safari: 15 << 16 | 4 << 8, chrome: 100 << 16, firefox: 100 << 16 };

const { code } = transform({
  filename: 'profile.css',
  code: readFileSync(src),
  minify: true,
  targets,
});

const text = code.toString();
writeFileSync(out, text);

const pct = Math.round((text.length / LIMIT) * 100);
const room = LIMIT - text.length;
console.log(`profile.min.css  ${text.length} / ${LIMIT} chars  (${pct}%, ${room} to spare)`);

if (text.length > LIMIT) {
  console.error(`\nOVER BUDGET by ${-room} characters. itch will reject this.`);
  process.exit(1);
}
