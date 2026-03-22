export type ProjectCategory = "game" | "site" | "software";

export interface Project {
  name: string;
  description: string;
  category: ProjectCategory;
  image?: string;
  itchUrl?: string;
  steamUrl?: string;
  githubUrl?: string;
  url?: string;
  primaryLink?: "itch" | "steam" | "github" | "url";
  featured?: boolean;
  context?: string;
  spacer?: boolean;
}

export interface ProjectGroup {
  description?: string;
  columns?: number;
  projects: Project[];
}

export interface Subsection {
  label: string;
  description?: string;
  compact?: boolean;
  groups: ProjectGroup[];
}

export interface CategoryConfig {
  label: string;
  subsections?: Subsection[];
}

export const projects: Project[] = [
  // Games
  {
    name: "The Curator",
    description:
      "You've woken up in an old cell. No idea how you got there but you know one thing. You need to escape.",
    category: "game",
    image: "/images/games/the-curator.png",
    itchUrl: "https://madebygare.itch.io/the-curator",
    featured: true,
    context:
      "[bumperoyster](https://bumperoyster.itch.io/), [bronxtaco](https://bronxtaco.itch.io/) and I teamed up again, this time for the [GMTK Game Jam 2025](https://itch.io/jam/gmtk-2025/rate/3746438). This game was inspired by Night Manor from UFO 50. I learned how stressful making a content heavy game in a short jam is with this one but I'm very happy with what we pulled off!  ",
  },
  {
    name: "Broom",
    description:
      "Timbo the squire ventures into the knight's private dungeon to save Sir Squidik.",
    category: "game",
    image: "/images/games/broom.png",
    itchUrl: "https://madebygare.itch.io/broom",
    context:
      "Another jam game with [bumperoyster](https://bumperoyster.itch.io/) and [bronxtaco](https://bronxtaco.itch.io/). My first foray into 3D, we made a Doom-like about a squire that has to save his knight, who's also a jerk. Made for the [GMTK Patreon Jam 2024](https://itch.io/jam/gmtk-patreon-2024/rate/3183013).",
  },
  {
    name: "Speluika",
    description: "Spelunky themed Suika clone.",
    category: "game",
    image: "/images/games/speluika.png",
    itchUrl: "https://madebygare.itch.io/speluika",
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
    context:
      "After working on [Bit Chunky](https://madebygare.itch.io/bit-chunky) I decided I'd like to make full release of a Spelunky-like. This was the first time [bumperoyster](https://bumperoyster.itch.io/), [bronxtaco](https://bronxtaco.itch.io/), and I all teamed up together. As of this writing this is still an ongoing project, definitely my biggest game to date.",
    featured: true,
  },
  {
    name: "Can't Stop Must Survive",
    description:
      "A survivor-style game featuring a player ship navigating an arena while combating skeleton enemies.",
    category: "game",
    image: "/images/games/cant-stop-must-survive.png",
    itchUrl: "https://madebygare.itch.io/cant-stop-must-survive",
    context:
      "Made for the [DAY 2 - Pass the GAME Challenge 2023](https://itch.io/jam/day-2/rate/2189029). This was an interesting jam where you take a game someone else made the day before, and someone else will continue from what you made in 24h.",
  },
  {
    name: "Bit Chunky",
    description: "Spelunky-like generation. See how deep you can go.",
    category: "game",
    image: "/images/games/bit-chunky.png",
    itchUrl: "https://madebygare.itch.io/bit-chunky",
    context:
      "Back to solo jamming for the [Kenney Jam 2023](https://itch.io/jam/kenney-jam-2023/rate/2183722). Only 48 hours, I used the excuse of provided assets to focus on making a Spelunky-like platforming, specifically focusing on the random generation with tilemaps in Godot. This was the precursor to [Corvian Curse](https://store.steampowered.com/app/2626080/Corvian_Curse/).",
  },
  {
    name: "Grind the Rich",
    description: "Skate the streets and mall in this anti-capitalism game.",
    category: "game",
    image: "/images/games/grind-the-rich.png",
    itchUrl: "https://madebygare.itch.io/grind-the-rich",
    context:
      "Made for the [🤭 Fuck Capitalism Jam 2023 🤭](https://itch.io/jam/fuck-capitalism-jam-2023/rate/2133498) with [bumperoyster](https://bumperoyster.itch.io/). This was really fun and the start of bumper and I collabing on more games.",
  },
  {
    name: "Fish Hell",
    description: "Underwater bullet hell. Can you beat the final boss?",
    category: "game",
    image: "/images/games/fish-hell.png",
    itchUrl: "https://madebygare.itch.io/fish-hell",
    context:
      "Made for the [Bullet Hell Jam 2023](https://itch.io/jam/bullet-hell-jam-2023/rate/2053487). Was a fun excuse to look into object pooling and making customizable bullet emitters to see how many bullets I could spam while keeping performance. First time collabing with [bronxtaco](https://bronxtaco.itch.io/) on audio.",
  },
  {
    name: "Word Cave",
    description: "Top down boggle-like. How fast can you reach the end?",
    category: "game",
    image: "/images/games/word-cave.png",
    itchUrl: "https://madebygare.itch.io/word-cave",
    context:
      "Made for the [Eggjam #17 - Designing Around Language](https://itch.io/jam/eggjam-17-designing-around-language/rate/1991636) game jam. I took inspiration from SpellTower for the input system but with a character that needs to avoid obstacles while making words.",
  },
  {
    name: "Jetpack Scream",
    description: "I have a Jetpack and I must Scream.",
    category: "game",
    image: "/images/games/jetpack-scream.png",
    itchUrl: "https://madebygare.itch.io/jetpack-scream",
    context:
      "This was my first game in Godot and where I fell in love with the engine. I made this for [Godot Wild Jam #49](https://itch.io/jam/godot-wild-jam-49/rate/1700967). I really liked the premise of having to skid to stop yourself from going too far forward while something behind you prevents you from going too far back.",
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
    name: "GDC Schedule 2026",
    description: "A filterable schedule viewer for GDC 2026.",
    category: "software",
    url: "/gdc-schedule/",
    primaryLink: "url",
    context:
      "Tired of the schedule that GDC provides on their website, I decided to make my own that is much easier to use.",
  },
];

export const softwareSubsections: Subsection[] = [
  {
    label: "Spelunky",
    groups: [
      {
        description:
          "Low-level libraries for injecting into and modding Spelunky HD.",
        columns: 3,
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
        columns: 2,
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
    compact: true,
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
