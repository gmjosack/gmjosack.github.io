export interface WebringSite {
  name: string;
  title: string;
  description: string;
  url: string;
}

// Add your own sites here
export const localSites: WebringSite[] = [
  {
    name: "MossRanking",
    title: "MossRanking",
    description: "Spelunky speedrunning!",
    url: "https://mossranking.com/",
  },
  {
    name: "Spelunky FYI",
    title: "Spelunky FYI",
    description: "Spelunky modding!",
    url: "https://spelunky.fyi/",
  },
  {
    name: "Puzzmo",
    title: "Puzzmo",
    description: "Awesome Daily Puzzles",
    url: "https://puzzmo.com/",
  },
];
