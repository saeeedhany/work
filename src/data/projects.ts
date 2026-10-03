export type Tier = "interface" | "logic" | "data" | "hosting";

export interface Section {
  name: string;
  result: string;
  design: string;
}

export interface Project {
  slug: string;
  title: string;
  year: number;
  kind: "Web app" | "Website" | "UI design";
  summary: string;
  url?: string;
  repo?: string;
  sections: Section[];
  stack: { name: string; tier: Tier }[];
  sample?: boolean;
}

const shots = (slug: string, ext: string, ...names: string[]): Section[] =>
  names.map((name) => {
    const file = name.toLowerCase();
    return { name, result: `/work/${slug}/${file}-result.${ext}`, design: `/work/${slug}/${file}-design.${ext}` };
  });

export const projects: Project[] = [
  {
    slug: "saeeedhany",
    title: "Saeed Hany",
    year: 2026,
    kind: "Website",
    summary: "My own site: essays, a library of book notes and a gallery, in English and Arabic, with manuscript plates dithered into a single ink.",
    url: "https://saeeedhany.github.io",
    repo: "https://github.com/saeeedhany/saeeedhany.github.io",
    sections: shots("saeeedhany", "webp", "Home", "Writing", "Library", "Arabic"),
    stack: [
      { name: "Astro 7", tier: "interface" },
      { name: "Layered CSS", tier: "interface" },
      { name: "Lenis", tier: "interface" },
      { name: "TypeScript", tier: "logic" },
      { name: "Sätteri Markdown", tier: "logic" },
      { name: "Content collections", tier: "data" },
      { name: "Python + ImageMagick", tier: "data" },
      { name: "GitHub Actions", tier: "hosting" },
      { name: "GitHub Pages", tier: "hosting" },
    ],
  },
  {
    slug: "youssuf",
    title: "Youssuf",
    year: 2026,
    kind: "Website",
    summary: "A blog for Youssuf that lives in a scene: diaries, a polaroid gallery and a music notch floating over a looping sunset beach, with a pull-cord for the lights.",
    url: "https://usifreyad.github.io",
    repo: "https://github.com/usifreyad/usifreyad.github.io",
    sections: shots("youssuf", "webp", "Diaries", "Gallery", "Scene"),
    stack: [
      { name: "Vite", tier: "interface" },
      { name: "Plain CSS", tier: "interface" },
      { name: "Fontsource", tier: "interface" },
      { name: "TypeScript", tier: "logic" },
      { name: "marked", tier: "logic" },
      { name: "Vitest", tier: "logic" },
      { name: "Playwright", tier: "logic" },
      { name: "Markdown + JSON", tier: "data" },
      { name: "vite-imagetools", tier: "data" },
      { name: "GitHub Actions", tier: "hosting" },
      { name: "GitHub Pages", tier: "hosting" },
    ],
  },
  {
    slug: "alkhizanah",
    title: "Al Khizanah",
    year: 2026,
    kind: "Website",
    summary: "One home for the Al Khizanah open-source collective: its nine projects, their docs and posts, with live star and fork counts from GitHub.",
    url: "https://alkhizanah.github.io",
    repo: "https://github.com/alkhizanah/alkhizanah.github.io",
    sections: shots("alkhizanah", "webp", "Home", "Projects", "Docs"),
    stack: [
      { name: "Jekyll", tier: "interface" },
      { name: "Liquid", tier: "interface" },
      { name: "Sass", tier: "interface" },
      { name: "Vanilla JS", tier: "logic" },
      { name: "YAML data", tier: "data" },
      { name: "GitHub REST API", tier: "data" },
      { name: "GitHub Actions", tier: "hosting" },
      { name: "GitHub Pages", tier: "hosting" },
    ],
  },
];
