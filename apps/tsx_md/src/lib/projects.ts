export type ProjectGlyph =
  | "apl"
  | "circles"
  | "gears"
  | "impossible"
  | "iterseg"
  | "planable"
  | "push"
  | "spiro"
  | "triangles";

export interface AppProject {
  description: string;
  host: string;
  icon: string;
  name: string;
  url: string;
}

export interface TrinketProject {
  description: string;
  glyph?: ProjectGlyph;
  icon?: string;
  name: string;
  url: string;
  year: number;
}

export const APPS: readonly AppProject[] = [
  {
    description:
      "Dashboard for Alchemy stacks across Convex and Cloudflare, with PR previews and an OpenID identity hub.",
    host: "samebase.com",
    icon: "https://samebase.com/favicon-32.png",
    name: "Samebase",
    url: "https://samebase.com",
  },
  {
    description:
      "Legislation of the Republic of Moldova (110k+ acts), with cross-links and fast search.",
    host: "legix.md",
    icon: "https://legix.md/favicon-32.png",
    name: "Legix",
    url: "https://legix.md",
  },
  {
    description:
      "Chess variant inspired by Chess Plus where pieces can merge and split.",
    host: "chessmerge.com",
    icon: "https://chessmerge.com/bishop_horse.svg",
    name: "ChessMerge",
    url: "https://chessmerge.com",
  },
  {
    description:
      "Browser game testing, product reviews, and agent task comparisons.",
    host: "scout.samebase.com",
    icon: "https://scout.samebase.com/scout-mark.png",
    name: "TrailScout",
    url: "https://scout.samebase.com",
  },
];

export const TRINKETS: readonly TrinketProject[] = [
  {
    description:
      "3D digital twin for a USB-tethered Ableton Push 3 in the browser",
    glyph: "push",
    name: "Push 3 Twin",
    url: "https://push.tsx.md",
    year: 2026,
  },
  {
    description: "shared Game of Life in APL on a Durable Object",
    glyph: "apl",
    name: "Built in APL",
    url: "https://maybeapl.tsx.md",
    year: 2026,
  },
  {
    description: "wooden 3D two-player board game",
    icon: "https://insightful-crow-151.eu-west-1.convex.site/favicon.svg",
    name: "Score Four",
    url: "https://insightful-crow-151.eu-west-1.convex.site",
    year: 2026,
  },
  {
    description: "4×4×4 3D tic-tac-toe with a friend",
    icon: "https://majestic-cormorant-166.eu-west-1.convex.site/favicon.svg",
    name: "Fourfold",
    url: "https://majestic-cormorant-166.eu-west-1.convex.site",
    year: 2026,
  },
];

export const PRE_AI_TRINKETS: readonly TrinketProject[] = [
  {
    description: "interactive SVG geometry study",
    glyph: "planable",
    name: "Planable Logo",
    url: "https://planable-logo.pfp.workers.dev",
    year: 2019,
  },
  {
    description: "recursive circle canvas, 4 static files",
    glyph: "circles",
    name: "Fractal Circles",
    url: "https://fractal-circles.pfp.workers.dev",
    year: 2018,
  },
  {
    description: "interlocking gears demo in Elm 0.18",
    glyph: "gears",
    name: "Elm Gears",
    url: "https://elm-gears-challenge.pfp.workers.dev",
    year: 2017,
  },
  {
    description: "Delaunay triangulation & text-to-triangles",
    glyph: "triangles",
    name: "Triangle Image",
    url: "https://triangle-image.pfp.workers.dev",
    year: 2017,
  },
  {
    description: "interactive optical illusion (JSMD #0)",
    glyph: "impossible",
    name: "Impossible Object",
    url: "https://impossible-object.pfp.workers.dev",
    year: 2017,
  },
  {
    description: "multi-arm rotating spirograph",
    glyph: "spiro",
    name: "Spiro",
    url: "https://spiro.pfp.workers.dev",
    year: 2015,
  },
  {
    description: "interactive line-segment fractals",
    glyph: "iterseg",
    name: "Iterseg",
    url: "https://iterseg.pfp.workers.dev",
    year: 2014,
  },
];
