# itch.io profile theme

Themes [madebygare.itch.io](https://madebygare.itch.io/) to match this site: the
same neutral dark ground and faint grain, one orange accent, Archivo condensed
for names and IBM Plex Mono for data — and the chip, the notched sticker panel
with a hard stroke and a black offset shadow that presses in when you pick it
up. Every game cell in the grid becomes one.

| File             | What it is                                          |
| ---------------- | --------------------------------------------------- |
| `profile.css`    | the source. Documented, readable, too big to paste.  |
| `build.mjs`      | strips comments and minifies. `node itch/build.mjs`  |
| `profile.min.css`| what goes in itch's box. Currently 4329 / 5120 chars |

**itch's CSS box holds 5120 characters.** That cap is the design constraint on
this theme, not a footnote: it is why the tokens are two letters, why the notch
polygon is written out rather than shared, and why anything speculative is
absent. `build.mjs` prints the count and exits non-zero if a change puts it over.
Comments are free — they don't survive minification — so document the source
freely.

The ramp at the top of `profile.css` is copied from `src/styles/global.css`. If
it changes there, change it here too; that duplication is the price of itch
having no build step, and it's the only part of this that can silently drift.

## Applying it

1. `node itch/build.mjs`
2. Edit profile → **Theme** → paste `profile.min.css` into the custom CSS box.
3. In the same theme editor, set the parts custom CSS cannot reach. The editor's
   output lands _inside_ `.user_page`, and a variable an element sets on itself
   beats one it inherits — which is why the CSS re-states itch's variables on
   `#wrapper .user_page`. But the page background is set on `<body>`, outside
   `#wrapper`, and nothing scoped can touch it:

   | Setting          | Value     | Why                                          |
   | ---------------- | --------- | -------------------------------------------- |
   | Background       | `#171918` | the one that genuinely can't be reached      |
   | Text             | `#e6e8e7` | belt and braces; the CSS sets it too         |
   | Link             | `#f97316` | the accent                                   |
   | Border           | `#2c2f2e` |                                              |
   | Secondary / gray | `#202221` | the chip's surface                           |
   | Border radius    | `0`       | the notch is the corner treatment            |
   | Font size        | `100%`    | it's at 131%, which the CSS pins back to 16px |

4. Check the page **logged out** and at a phone width. itch asks for both.
   Logged out matters because the follow button and the collection tools only
   exist for signed-in visitors.

## What it touches

- **Title** — the account name in condensed heavy caps with the pixel rule under
  it. Upload a profile banner and itch hides the title outright; the rule moves
  to the header in that case, which is what the `.has_banner` block is for.
- **Links row** — each becomes a small chip that takes the accent on hover.
- **Game grid** — the chip at full size. itch's grid tracks are untouched; only
  the column gap (through itch's own `--itchio_grid_gap`) and `align-items`.
- **Card interior** — title in Archivo, description in Plex Sans, genre and
  platform in mono under a hairline, and "Play in browser" as an accent-tinted
  badge, which is the one thing on a card you can act on before clicking it.

## What was cut for budget, and what it costs to add back

Roughly 790 characters are spare. In rough order of value if you want them:

| Cut                                      | Cost  | Worth it when                    |
| ---------------------------------------- | ----- | -------------------------------- |
| Bio prose styles (`.user_profile`)       | ~600  | you write a profile bio          |
| `custom-` kit (plate, lede, cta, label)  | ~700  | the bio needs more than prose    |
| Section headings (`h2`) in accent caps   | ~180  | you show a collection row        |
| IBM Plex Mono 500 for label weight       | ~185  | probably never — 400 synthesizes |
| Price / sale tag flattening (`.meta_tag`)| ~200  | a game gets a price              |

Both kits are in this file's git history at the commit that introduced it, which
is the cheapest place to get them back from.

The other lever, if you ever need a lot of room at once: replacing the three
`@font-face` blocks with a single `@import url(https://fonts.googleapis.com/css2?…)`
saves about 400 characters and picks up every subset. It is untested against
itch's sanitizer, which is why it isn't the default.

## Never style state, only looks

Every rule is scoped under `#wrapper`, which itch requires. That gives each one
ID specificity, so it outranks anything itch selects by class — which is most of
itch's own stylesheet, and all of the theme editor's output. The page therefore
has a failure mode ordinary CSS does not: **a rule can win an argument you did
not know it was having.**

It already happened once, on the Celestial Particles page.
`#wrapper .game_frame iframe { display: block }` was there to drop the inline
baseline gap under the iframe. itch hides the still-running game with a class
when you navigate back and offers "Restore game" over the top, and this rule beat
that class. The game kept running and kept painting, over the comments, while
the restore button sat on the frame.

So: **state the narrowest property that gets the look.** Don't set `display`,
`visibility`, `opacity`, `position`, `overflow`, `z-index`, `height` or
`pointer-events` on anything itch owns — those are the properties itch toggles.
On this page it uses them to:

- hide `.text_header` and show `.image_header` when a banner exists
- hide `.game_author` on your own grid, and hide `.game_text` / `.game_genre` /
  `.game_platform` on cells that aren't yours
- clamp `.game_title` to two lines with `-webkit-line-clamp`
- fade `.game_cell_tools` and `.gif_overlay` in on hover
- turn the grid into a horizontal scroller under 800px in column mode

That's why the pixel rule under the title is a background on the heading's own
padding rather than a `::after { flex: 1 }` the way `global.css` does it: the
site's version needs `display: flex` on the heading, and on project pages itch
already toggles an `h1`'s display. The dash loses its indent under the text; it
buys not having that fight, and it's 40 characters cheaper.

`align-items: stretch` on `.game_grid_widget` is the one deliberate exception.
It's a layout property, not a state property, and itch never toggles it. Without
it, a row of cards with hard strokes ends at four different heights and reads as
broken rather than as loose.

## One that bit, in case it bites again

The notch polygon is written out twice — once on `.link_group`, once on
`.game_cell` — instead of living in a shared `--clip` variable. The shared
version does not work, and fails silently:

```css
#wrapper { --clip: polygon(0 0, calc(100% - var(--cut)) 0, …); }
#wrapper .game_cell { --cut: 12px; clip-path: var(--clip); }  /* no notch */
```

`var()` inside a custom property resolves against the element the property is
**declared** on, not the one that uses it. `--clip` computed on `#wrapper`, where
`--cut` doesn't exist, so the whole value went guaranteed-invalid and `clip-path`
dropped. No error, no warning — just square cards. It's only visible if you look
at a corner at 2x, which is how it was caught.

## Selectors

itch documents `#wrapper`, `#inner_column`, `.header`, `h1`, `img`, `.columns`,
`.left_col.column`, `.formatted_description`, `.right_col.column`, `.footer`,
`.embed_wrapper` and `.game_frame` — and **all of those are project-page
selectors**. The guide has no structural documentation for profile pages at all,
so apart from `#wrapper` and `.footer`, everything here was read off the rendered
page and out of itch's own stylesheet: `.user_page`, `.text_header`,
`.has_banner`, `.user_links`, `.link_group`, `.game_grid_widget`, `.game_cell`,
`.game_thumb`, `.thumb_link`, `.game_cell_data`, `.game_title`, `.game_text`,
`.game_genre`, `.game_platform`, `.web_flag`.

Same for itch's variables — `--itchio_body_color`, `--itchio_gray_back`,
`--itchio_border_color`, `--itchio_grid_gap` and the rest. Re-pointing those nine
is the cheapest lever on the page: every itch rule that reads one lands in the
right register without this file overriding the rule that uses it. But they are
internals and can be renamed without notice.

If a section reverts to itch's default look after a site update, that's what
happened, and the fix is to re-read the class name rather than to fight it.

## External references

Three woff2 from Google's CDN and one grain tile from `madebygare.com`. The
guide's "External content" section is explicit that HTTPS-hosted fonts and images
are the supported way to do this, and both hosts qualify. Everything degrades:

- **Fonts.** Google versions these paths (`/s/archivo/v25/…`). If one 404s, the
  stacks fall through to Arial Narrow and the system mono and the page still
  reads, just flatter. To refresh, request the CSS with a modern browser's
  user-agent — `curl -A "Mozilla/5.0 … Chrome/120" "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&display=swap"`
  — and take the `latin` block's URL. Archivo's single file carries both the
  weight and width axes, which is what lets the display role be condensed and
  heavy for one download.
- **Grain.** One 16KB tile, washed back to ~4.5% by a near-opaque layer of the
  background color over it. Delete the `background-image` line on `#wrapper` and
  the ground is flat but fine.

## Two things worth doing that aren't CSS

- The title renders the **account name**, so it reads `MADEBYGARE`. Setting the
  display name to `Made By Gare` in profile settings makes it read as the
  wordmark does everywhere else.
- A **profile banner** would put the actual wordmark up top. itch hides the text
  title whenever one is present, so the image becomes the only thing naming the
  page — the same trade the Celestial Particles page makes.
