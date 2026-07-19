// Downloads the latest release of each game in games.yml into public/games/.
// Requires the `gh` CLI (authed locally, or GH_TOKEN in CI).
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { games } = parse(readFileSync(join(root, "games.yml"), "utf8"));

for (const game of games) {
  const dest = join(root, "public", "games", game.name);
  console.log(`Fetching latest release of ${game.repo} -> public/games/${game.name}/`);

  const tmp = mkdtempSync(join(tmpdir(), "fetch-game-"));
  try {
    const zip = join(tmp, "game.zip");
    execFileSync(
      "gh",
      ["release", "download", "--repo", game.repo, "--pattern", game.pattern ?? "*.zip", "--output", zip],
      { stdio: "inherit" },
    );

    rmSync(dest, { recursive: true, force: true });
    mkdirSync(dest, { recursive: true });
    if (process.platform === "win32") {
      // bsdtar (built into Windows) handles zip archives
      execFileSync("tar", ["-xf", zip, "-C", dest], { stdio: "inherit" });
    } else {
      execFileSync("unzip", ["-q", "-o", zip, "-d", dest], { stdio: "inherit" });
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
