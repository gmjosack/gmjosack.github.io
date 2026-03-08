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
    name: "Corvian Curse",
    description:
      "A roguelike platformer that offers a new experience on every run with randomized levels, potions, and items.",
    category: "game",
    image: "/images/games/corvian-curse.png",
    itchUrl: "https://madebygare.itch.io/corvian-curse",
    steamUrl: "https://store.steampowered.com/app/2626080/Corvian_Curse/",
  },
  {
    name: "Jetpack Scream",
    description: "I have a Jetpack and I must Scream.",
    category: "game",
    image: "/images/games/jetpack-scream.png",
    itchUrl: "https://madebygare.itch.io/jetpack-scream",
  },
  {
    name: "Word Cave",
    description: "Top down boggle-like. How fast can you reach the end?",
    category: "game",
    image: "/images/games/word-cave.png",
    itchUrl: "https://madebygare.itch.io/word-cave",
  },
  {
    name: "Fish Hell",
    description: "Underwater bullet hell. Can you beat the final boss?",
    category: "game",
    image: "/images/games/fish-hell.png",
    itchUrl: "https://madebygare.itch.io/fish-hell",
  },
  {
    name: "Grind the Rich",
    description: "Skate the streets and mall in this anti-capitalism game.",
    category: "game",
    image: "/images/games/grind-the-rich.png",
    itchUrl: "https://madebygare.itch.io/grind-the-rich",
  },
  {
    name: "Bit Chunky",
    description: "Spelunky-like generation. See how deep you can go.",
    category: "game",
    image: "/images/games/bit-chunky.png",
    itchUrl: "https://madebygare.itch.io/bit-chunky",
  },
  {
    name: "Can't Stop Must Survive",
    description:
      "A survivor-style game featuring a player ship navigating an arena while combating skeleton enemies.",
    category: "game",
    image: "/images/games/cant-stop-must-survive.png",
    itchUrl: "https://madebygare.itch.io/cant-stop-must-survive",
  },
  {
    name: "Speluika",
    description: "Spelunky themed Suika clone.",
    category: "game",
    image: "/images/games/speluika.png",
    itchUrl: "https://madebygare.itch.io/speluika",
  },
  {
    name: "Broom",
    description:
      "Timbo the squire ventures into the knight's private dungeon to save Sir Squidik.",
    category: "game",
    image: "/images/games/broom.png",
    itchUrl: "https://madebygare.itch.io/broom",
  },
  {
    name: "The Curator",
    description:
      "You've woken up in an old cell. No idea how you got there but you know one thing. You need to escape.",
    category: "game",
    image: "/images/games/the-curator.png",
    itchUrl: "https://madebygare.itch.io/the-curator",
  },

  // Sites
  {
    name: "MossRanking",
    description:
      "A leaderboard and ranking website for speedruns, scoreruns, and various challenges in the Spelunky series.",
    category: "site",
    url: "https://mossranking.com/",
  },
  {
    name: "Spelunky FYI",
    description:
      "A resource site for the Spelunky community with tools, guides, mod repositories, and more.",
    category: "site",
    url: "https://spelunky.fyi/",
  },

  // Software (top-level)
  {
    name: "What Pressed",
    description:
      "A desktop app that captures and displays keyboard, mouse, and gamepad inputs for streaming overlays.",
    category: "software",
    githubUrl: "https://github.com/made-by-gare/what-pressed",
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
            description: "Name Service Switch module that uses an HTTP server as a backend.",
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
            description: "A suite of tools for ingesting and displaying SNMP traps.",
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
