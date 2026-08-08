export type ProjectCategory = "game" | "site" | "software";

export type Platform = "web" | "windows" | "mac" | "linux";

/** Icon and human label per platform, in the order they render. */
export const platformMeta: Record<
  Platform,
  { icon: "globe" | "windows" | "apple" | "linux"; label: string }
> = {
  web: { icon: "globe", label: "Browser" },
  windows: { icon: "windows", label: "Windows" },
  mac: { icon: "apple", label: "macOS" },
  linux: { icon: "linux", label: "Linux" },
};

export const platformOrder: Platform[] = ["web", "windows", "mac", "linux"];

export interface Project {
  name: string;
  description: string;
  category: ProjectCategory;
  image?: string;
  itchUrl?: string;
  steamUrl?: string;
  githubUrl?: string;
  url?: string;
  urlLabel?: string;
  primaryLink?: "itch" | "steam" | "github" | "url";
  featured?: boolean;
  /** The story behind the project. Facts that belong in the stat strip below
      should live in their own fields, not be restated here. */
  context?: string;
  spacer?: boolean;

  // --- Stat strip -----------------------------------------------------------
  // All optional. Not every project is a jam entry, and the strip renders only
  // what is present.
  engine?: string;
  year?: number;
  jam?: { name: string; url?: string };
  /** For work that hasn't shipped. Use instead of a year rather than alongside
      one, so an in-progress game isn't stamped with a date it never launched. */
  status?: string;
  // Note: there is deliberately no `credits` field. Who worked on a project
  // stays in `context` as a normal sentence — a structured crew list was tried
  // and pulled, because it read as a rigid roster where the prose reads like
  // someone talking about their friends.
  /** What it actually runs on. "web" means playable in a browser, which is not
      the same as having a web page — a downloadable game on itch is not web. */
  platforms?: Platform[];
}

export interface ProjectGroup {
  description?: string;
  projects: Project[];
}

export interface Subsection {
  label: string;
  description?: string;
  /** No longer maintained. Renders quieter rather than carrying a badge. */
  archived?: boolean;
  groups: ProjectGroup[];
}

export interface CategoryConfig {
  label: string;
  subsections?: Subsection[];
}

export const projects: Project[] = [
  // Games
  {
    name: "Corvian Cards",
    description: "A daily trick taking game set in the world of Corvian Curse.",
    category: "game",
    image: "/images/games/corvian-cards.png",
    url: "/games/corvian-cards/",
    urlLabel: "Play",
    primaryLink: "url",
    itchUrl: "https://madebygare.itch.io/corvian-cards",
    engine: "TypeScript",
    year: 2026,
    platforms: ["web"],
    jam: {
      name: "Secret Jam of Games #29",
      url: "https://itch.io/jam/secret-jam-of-games-29",
    },
    context:
      "[bumperoyster](https://bumperoyster.itch.io/) again on art and [bronxtaco](https://bronxtaco.itch.io/) on audio and our one man QA team. I've been playing a lot of trick taking games lately and wanted to look into making one into a daily web game. It was a fun challenge but I missed working in Godot heh.",
  },
  {
    name: "The Curator",
    description:
      "You've woken up in an old cell. No idea how you got there but you know one thing. You need to escape.",
    category: "game",
    image: "/images/games/the-curator.png",
    itchUrl: "https://madebygare.itch.io/the-curator",
    engine: "Godot 4",
    year: 2025,
    platforms: ["web"],
    jam: {
      name: "GMTK Game Jam 2025",
      url: "https://itch.io/jam/gmtk-2025/rate/3746438",
    },
    context:
      "[bumperoyster](https://bumperoyster.itch.io/), [bronxtaco](https://bronxtaco.itch.io/) and I teamed up again. This game was inspired by Night Manor from UFO 50. I learned how stressful making a content heavy game in a short jam is with this one but I'm very happy with what we pulled off!",
  },
  {
    name: "Broom",
    description:
      "Timbo the squire ventures into the knight's private dungeon to save Sir Squidik.",
    category: "game",
    image: "/images/games/broom.png",
    itchUrl: "https://madebygare.itch.io/broom",
    engine: "Godot 4",
    year: 2024,
    platforms: ["windows", "mac"],
    jam: {
      name: "GMTK Patreon Jam 2024",
      url: "https://itch.io/jam/gmtk-patreon-2024/rate/3183013",
    },
    context:
      "Another jam game with [bumperoyster](https://bumperoyster.itch.io/) and [bronxtaco](https://bronxtaco.itch.io/). My first foray into 3D, we made a Doom-like about a squire that has to save his knight, who's also a jerk.",
  },
  {
    name: "Speluika",
    description: "Spelunky themed Suika clone.",
    category: "game",
    image: "/images/games/speluika.png",
    itchUrl: "https://madebygare.itch.io/speluika",
    engine: "Godot 4",
    year: 2023,
    platforms: ["web", "windows", "mac"],
    context:
      'I made this mostly as a joke when Suika was popular. I thought "That can\'t take very long to make..." I used assets from Spelunky Classic and had it working in a few hours. Embarrassingly, it has been one of my most popular games.',
  },
  {
    name: "Corvian Curse",
    description:
      "A roguelike platformer that offers a new experience on every run with randomized levels, potions, and items.",
    category: "game",
    image: "/images/games/corvian-curse.png",
    itchUrl: "https://madebygare.itch.io/corvian-curse",
    steamUrl: "https://store.steampowered.com/app/2626080/Corvian_Curse/",
    primaryLink: "steam",
    engine: "Godot 4",
    status: "In development",
    platforms: ["windows", "linux"],
    context:
      "After working on [Bit Chunky](https://madebygare.itch.io/bit-chunky) I decided I'd like to make full release of a Spelunky-like. This was the first time [bumperoyster](https://bumperoyster.itch.io/), [bronxtaco](https://bronxtaco.itch.io/), and I all teamed up together. Definitely my biggest game to date.",
    featured: true,
  },
  {
    name: "Can't Stop Must Survive",
    description:
      "A survivor-style game featuring a player ship navigating an arena while combating skeleton enemies.",
    category: "game",
    image: "/images/games/cant-stop-must-survive.png",
    itchUrl: "https://madebygare.itch.io/cant-stop-must-survive",
    engine: "Godot 4",
    year: 2023,
    platforms: ["web", "mac"],
    jam: {
      name: "Pass the GAME Challenge 2023",
      url: "https://itch.io/jam/day-2/rate/2189029",
    },
    context:
      "This was an interesting jam where you take a game someone else made the day before, and someone else will continue from what you made in 24h.",
  },
  {
    name: "Bit Chunky",
    description: "Spelunky-like generation. See how deep you can go.",
    category: "game",
    image: "/images/games/bit-chunky.png",
    itchUrl: "https://madebygare.itch.io/bit-chunky",
    engine: "Godot 4",
    year: 2023,
    platforms: ["web", "windows", "mac"],
    jam: {
      name: "Kenney Jam 2023",
      url: "https://itch.io/jam/kenney-jam-2023/rate/2183722",
    },
    context:
      "Back to solo jamming. Only 48 hours, I used the excuse of provided assets to focus on making a Spelunky-like platforming, specifically focusing on the random generation with tilemaps in Godot. This was the precursor to [Corvian Curse](https://store.steampowered.com/app/2626080/Corvian_Curse/).",
  },
  {
    name: "Grind the Rich",
    description: "Skate the streets and mall in this anti-capitalism game.",
    category: "game",
    image: "/images/games/grind-the-rich.png",
    itchUrl: "https://madebygare.itch.io/grind-the-rich",
    engine: "Godot 4",
    year: 2023,
    platforms: ["web", "windows", "mac"],
    jam: {
      name: "Fuck Capitalism Jam 2023",
      url: "https://itch.io/jam/fuck-capitalism-jam-2023/rate/2133498",
    },
    context:
      "Made with [bumperoyster](https://bumperoyster.itch.io/). This was really fun and the start of bumper and I collabing on more games.",
  },
  {
    name: "Fish Hell",
    description: "Underwater bullet hell. Can you beat the final boss?",
    category: "game",
    image: "/images/games/fish-hell.png",
    itchUrl: "https://madebygare.itch.io/fish-hell",
    engine: "Godot 4",
    year: 2023,
    platforms: ["web", "windows", "mac"],
    jam: {
      name: "Bullet Hell Jam 2023",
      url: "https://itch.io/jam/bullet-hell-jam-2023/rate/2053487",
    },
    context:
      "Was a fun excuse to look into object pooling and making customizable bullet emitters to see how many bullets I could spam while keeping performance. First time collabing with [bronxtaco](https://bronxtaco.itch.io/) on audio.",
  },
  {
    name: "Word Cave",
    description: "Top down boggle-like. How fast can you reach the end?",
    category: "game",
    image: "/images/games/word-cave.png",
    itchUrl: "https://madebygare.itch.io/word-cave",
    engine: "Godot 4",
    year: 2023,
    platforms: ["web", "windows", "mac"],
    jam: {
      name: "Eggjam #17",
      url: "https://itch.io/jam/eggjam-17-designing-around-language/rate/1991636",
    },
    context:
      "I took inspiration from SpellTower for the input system but with a character that needs to avoid obstacles while making words.",
  },
  {
    name: "Jetpack Scream",
    description: "I have a Jetpack and I must Scream.",
    category: "game",
    image: "/images/games/jetpack-scream.png",
    itchUrl: "https://madebygare.itch.io/jetpack-scream",
    engine: "Godot 3",
    year: 2022,
    platforms: ["web"],
    jam: {
      name: "Godot Wild Jam #49",
      url: "https://itch.io/jam/godot-wild-jam-49/rate/1700967",
    },
    context:
      "This was my first game in Godot and where I fell in love with the engine. I really liked the premise of having to skid to stop yourself from going too far forward while something behind you prevents you from going too far back.",
  },

  // Sites
  {
    name: "MossRanking",
    description:
      "A leaderboard and ranking website for speedruns, scoreruns, and various challenges in the Spelunky series.",
    category: "site",
    url: "https://mossranking.com/",
    context:
      "Originally created by saturnin55, I took over development in 2021 where I modernized the codebase, updated the design, and have continued to add new features.",
  },
  {
    name: "Spelunky FYI",
    description:
      "A resource site for the Spelunky community with tools, guides, mod repositories, and more.",
    category: "site",
    url: "https://spelunky.fyi/",
    context:
      "Originally planned to just be a place to throw tools for Spelunky 2, it has evolved to be the hosting platform for all Spelunky games.",
  },

  // Software (top-level)
  {
    name: "What Pressed",
    description:
      "A desktop app that captures and displays keyboard, mouse, and gamepad inputs for streaming overlays.",
    category: "software",
    githubUrl: "https://github.com/made-by-gare/what-pressed",
  },
  {
    name: "GDC Schedule",
    description: "A filterable schedule viewer for GDC.",
    category: "software",
    url: "/gdc-schedule/",
    primaryLink: "url",
    context:
      "While at GDC in 2026 I got tired of the schedule they provide on their website. I decided to make my own that is much easier to use.",
  },
  {
    name: "Watermark Scanner",
    description: "Recursively scan directories containing PDFs for watermarks.",
    category: "software",
    githubUrl: "https://github.com/made-by-gare/watermark-scanner",
  },
];

export const softwareSubsections: Subsection[] = [
  {
    label: "Spelunky",
    groups: [
      {
        description:
          "Low-level libraries for injecting into and modding Spelunky HD.",
        projects: [
          {
            name: "HDDLL",
            description:
              "A reusable C++ static library for building DLLs to inject into Spelunky HD with DirectX 9 hooking, ImGui overlay, and memory patching.",
            category: "software",
            githubUrl: "https://github.com/spelunky-fyi/HDDLL",
          },
          {
            name: "SpecsHD",
            description:
              "A Spelunky HD debugging DLL. The technical foundation for HD Toolbox.",
            category: "software",
            githubUrl: "https://github.com/spelunky-fyi/SpecsHD",
          },
          {
            name: "WebHD-DLL",
            description:
              "A DLL for Spelunky HD that enables web-based integrations.",
            category: "software",
            githubUrl: "https://github.com/spelunky-fyi/WebHD-DLL",
          },
        ],
      },
      {
        description: "End-user tools for managing and modding Spelunky games.",
        projects: [
          {
            name: "HD Toolbox",
            description:
              "A toolbox for Spelunky HD with level viewing, overlay injection, save management, asset handling, and trackers.",
            category: "software",
            githubUrl: "https://github.com/spelunky-fyi/HD-Toolbox",
          },
          {
            name: "Modlunky 2",
            description:
              "A tool for creating and using Spelunky 2 mods with mod management, level editing, asset extraction, and speedrun tracking.",
            category: "software",
            githubUrl: "https://github.com/spelunky-fyi/modlunky2",
          },
        ],
      },
    ],
  },
  {
    label: "Graveyard",
    description:
      "These are large or interesting projects I'd worked on in the past but are currently either unmaintained or I no longer work for the company where they were created.",
    archived: true,
    groups: [
      {
        projects: [
          {
            name: "gsh",
            description: "Pluggable version of Distributed Shell.",
            category: "software",
            githubUrl: "https://github.com/gmjosack/gsh",
          },
          {
            name: "pygerduty",
            description: "Python Library for PagerDuty's REST API.",
            category: "software",
            githubUrl: "https://github.com/dropbox/pygerduty",
          },
          {
            name: "nss_http",
            description:
              "Name Service Switch module that uses an HTTP server as a backend.",
            category: "software",
            githubUrl: "https://github.com/gmjosack/nss_http",
          },
          {
            name: "tattrdb",
            description: "Tag and Attribute Database.",
            category: "software",
            githubUrl: "https://github.com/gmjosack/tattrdb",
          },
          {
            name: "annex",
            description: "Simple Plugin System for Python.",
            category: "software",
            githubUrl: "https://github.com/gmjosack/annex",
          },
          {
            name: "trapperkeeper",
            description:
              "A suite of tools for ingesting and displaying SNMP traps.",
            category: "software",
            githubUrl: "https://github.com/dropbox/trapperkeeper",
          },
          {
            name: "nsot",
            description: "Network Source of Truth.",
            category: "software",
            githubUrl: "https://github.com/dropbox/nsot",
          },
          {
            name: "merou",
            description: "Permission management service.",
            category: "software",
            githubUrl: "https://github.com/dropbox/merou",
          },
        ],
      },
    ],
  },
];

export const categoryLabels: Record<ProjectCategory, string> = {
  game: "Games",
  site: "Sites",
  software: "Software",
};

export const categoryOrder: ProjectCategory[] = ["game", "site", "software"];
