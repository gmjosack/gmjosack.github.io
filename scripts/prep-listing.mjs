// Prepares the photos for a /for-sale/ listing.
//
//   npm run prep-listing <listing-name> [--dry]
//
// Given a listing slug it works on public/images/for-sale/<slug>/ and
// src/content/for-sale/<slug>.md, and:
//
//   1. renames photos to photo-01.jpg, photo-02.jpg, ... so the public URLs
//      don't carry the camera's filename (PXL_<utc-timestamp>);
//   2. strips metadata (EXIF, XMP, IPTC and the appended HDR gain map, which
//      carries an XMP packet of its own) without recompressing, then verifies
//      nothing identifying survived;
//   3. rewrites the `images:` block in the .md, keeping any captions and alt
//      text already written for a photo even if its number changed.
//
// Safe to re-run. New photos dropped in the folder are appended to the end of
// the list; everything else keeps its position and its caption.
import { readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry");
const slug = args.find((a) => !a.startsWith("--"));

if (!slug) {
  console.error("usage: npm run prep-listing <listing-name> [--dry]");
  console.error("       (the name of the .md file in src/content/for-sale/, without the extension)");
  process.exit(1);
}

const imageDir = join(root, "public", "images", "for-sale", slug);
const mdPath = join(root, "src", "content", "for-sale", `${slug}.md`);
const publicPrefix = `/images/for-sale/${slug}`;

for (const [path, what] of [[imageDir, "image folder"], [mdPath, "listing"]]) {
  try {
    statSync(path);
  } catch {
    console.error(`No ${what} at ${path.slice(root.length + 1)}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------- metadata

// JPEG markers to drop: APP1 (Exif + XMP), APP3-APP15, and comments. APP0
// (JFIF) and APP2 (ICC colour profile) stay: structural, not identifying.
const JPEG_DROP = new Set([0xe1, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef, 0xfe]);
const JPEG_STANDALONE = new Set([0x01, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9]);

function stripJpeg(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("not a JPEG");
  const keep = [buf.subarray(0, 2)];
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error(`desynced at byte ${i}`);
    const marker = buf[i + 1];
    if (JPEG_STANDALONE.has(marker)) {
      keep.push(buf.subarray(i, i + 2));
      i += 2;
      continue;
    }
    const len = buf.readUInt16BE(i + 2);
    if (marker === 0xda) {
      // Entropy-coded data never contains a bare FFD9, so the next one ends
      // this image. Anything past it is an appended sub-image (the gain map).
      const end = buf.indexOf(Buffer.from([0xff, 0xd9]), i) + 2;
      keep.push(buf.subarray(i, end));
      return Buffer.concat(keep);
    }
    if (!JPEG_DROP.has(marker)) keep.push(buf.subarray(i, i + 2 + len));
    i += 2 + len;
  }
  return Buffer.concat(keep);
}

// PNG: drop the ancillary chunks that carry text or Exif. Everything else,
// including the image data and colour chunks, is copied through untouched.
const PNG_DROP = new Set(["tEXt", "zTXt", "iTXt", "eXIf", "tIME"]);

function stripPng(buf) {
  const keep = [buf.subarray(0, 8)];
  let i = 8;
  while (i < buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.toString("ascii", i + 4, i + 8);
    if (!PNG_DROP.has(type)) keep.push(buf.subarray(i, i + 12 + len));
    i += 12 + len;
  }
  return Buffer.concat(keep);
}

// Anything here surviving in the output means the strip missed something.
const LEAK_MARKERS = ["Exif\0", "http://ns.adobe.com/xap", "Photoshop 3.0", "ns.google", "GPSInfo", "PXL_"];

function findLeaks(buf) {
  const text = buf.toString("latin1");
  return LEAK_MARKERS.filter((m) => text.includes(m));
}

// ------------------------------------------------------------------ photos

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const numbered = /^photo-(\d+)\./i;

const files = readdirSync(imageDir).filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()));
if (files.length === 0) {
  console.error(`No images in public/images/for-sale/${slug}/`);
  process.exit(1);
}

// Already-numbered photos keep their order; anything new lands after them.
const already = files.filter((f) => numbered.test(f)).sort((a, b) => Number(a.match(numbered)[1]) - Number(b.match(numbered)[1]));
const fresh = files.filter((f) => !numbered.test(f)).sort();
const ordered = [...already, ...fresh];
const pad = String(ordered.length).length < 2 ? 2 : String(ordered.length).length;

const renames = new Map(); // old public src -> new public src
const plan = ordered.map((from, idx) => {
  const to = `photo-${String(idx + 1).padStart(pad, "0")}${extname(from).toLowerCase()}`;
  renames.set(`${publicPrefix}/${from}`, `${publicPrefix}/${to}`);
  return { from, to };
});

console.log(`${plan.length} photo(s) in public/images/for-sale/${slug}/`);

// Rename via temporary names so a resequence can't clobber a file it still needs.
if (!dryRun) {
  const moving = plan.filter((p) => p.from !== p.to);
  for (const p of moving) renameSync(join(imageDir, p.from), join(imageDir, `.prep-${p.to}`));
  for (const p of moving) renameSync(join(imageDir, `.prep-${p.to}`), join(imageDir, p.to));
}

let cleaned = 0;
let leaked = 0;
for (const { from, to } of plan) {
  const path = join(imageDir, dryRun ? from : to);
  const ext = extname(to).toLowerCase();
  const before = readFileSync(path);

  let after = before;
  if (ext === ".jpg" || ext === ".jpeg") after = stripJpeg(before);
  else if (ext === ".png") after = stripPng(before);
  else console.warn(`  ! ${to}: don't know how to strip ${ext}, left as-is`);

  const leaks = findLeaks(after);
  if (leaks.length) {
    console.warn(`  ! ${to}: metadata still present after stripping: ${leaks.join(", ")}`);
    leaked++;
  }

  const saved = before.length - after.length;
  if (saved > 0) cleaned++;
  const rename = from === to ? "" : `  (was ${from})`;
  console.log(`  ${to}${saved > 0 ? `  -${saved} bytes of metadata` : ""}${rename}`);

  if (!dryRun && saved > 0) writeFileSync(path, after);
}

// ------------------------------------------------------------------ the .md

const md = readFileSync(mdPath, "utf8");
const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!fm) {
  console.error(`${slug}.md has no frontmatter`);
  process.exit(1);
}

const yamlString = (s) => JSON.stringify(s); // JSON strings are valid YAML double-quoted scalars

function unquote(value) {
  const v = value.trim();
  if (v.startsWith('"')) return JSON.parse(v);
  if (v.startsWith("'")) return v.slice(1, -1).replaceAll("''", "'");
  return v;
}

// Pull src/alt/caption out of the existing images block. Deliberately a small
// line reader rather than a YAML parse: the rest of the frontmatter is spliced
// through untouched, so nothing here needs to round-trip.
function readImages(blockLines) {
  const entries = [];
  for (const line of blockLines) {
    if (!line.trim()) continue;
    const src = line.match(/^\s*-\s+src:\s*(.+)$/);
    if (src) {
      entries.push({ src: unquote(src[1]) });
      continue;
    }
    const field = line.match(/^\s+(alt|caption):\s*(.+)$/);
    if (field && entries.length) {
      entries.at(-1)[field[1]] = unquote(field[2]);
      continue;
    }
    console.warn(`  ! didn't understand this line in the images block, dropping it:\n      ${line}`);
  }
  return entries;
}

// Locate the existing block. It runs from `images:` to the next top-level key.
const lines = fm[1].split(/\r?\n/);
const start = lines.findIndex((l) => /^images:/.test(l));
let end = start + 1;
if (start !== -1) while (end < lines.length && !/^\S/.test(lines[end])) end++;

// Carry captions and alt text over to whatever the photo is called now.
const existing = new Map();
if (start !== -1) {
  for (const img of readImages(lines.slice(start + 1, end))) {
    existing.set(renames.get(img.src) ?? img.src, img);
  }
}

const block = ["images:"];
for (const { to } of plan) {
  const src = `${publicPrefix}/${to}`;
  const prev = existing.get(src);
  block.push(`  - src: ${src}`);
  if (prev?.alt) block.push(`    alt: ${yamlString(prev.alt)}`);
  if (prev?.caption) block.push(`    caption: ${yamlString(prev.caption)}`);
}

// Splice the new block in, leaving the rest of the frontmatter byte for byte
// as it was.
const updated = start === -1
  ? [...lines, ...block]
  : [...lines.slice(0, start), ...block, ...lines.slice(end)];

const out = md.replace(fm[0], `---\n${updated.join("\n")}\n---`);
const kept = plan.filter(({ to }) => {
  const prev = existing.get(`${publicPrefix}/${to}`);
  return prev?.alt || prev?.caption;
}).length;

if (dryRun) {
  console.log(`\n--- ${slug}.md images block (dry run, nothing written) ---`);
  console.log(block.join("\n"));
} else if (out !== md) {
  writeFileSync(mdPath, out);
  console.log(`\nUpdated images: in src/content/for-sale/${slug}.md`);
} else {
  console.log(`\nsrc/content/for-sale/${slug}.md already up to date`);
}

console.log(
  `${plan.length} listed, ${kept} kept existing captions, ${cleaned} had metadata removed, ` +
    (leaked ? `${leaked} STILL HAVE METADATA` : "0 leaks"),
);
if (leaked) process.exitCode = 1;
