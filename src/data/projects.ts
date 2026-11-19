export type Tier = "interface" | "logic" | "data" | "hosting";

export type Category = "clients" | "organizations" | "personal" | "reference";

export const categories: { id: Category; about: string }[] = [
  { id: "clients", about: "sites made for other people" },
  { id: "organizations", about: "homes and docs for groups and projects" },
  { id: "personal", about: "my own sites, newest first" },
  { id: "reference", about: "guides and explainers" },
];

export interface Section {
  name: string;
  result: string;
  design: string;
}

export interface Project {
  slug: string;
  title: string;
  year: number;
  category: Category;
  kind: "Website" | "Store" | "Docs" | "Blog" | "Web app" | "Dashboard" | "Experiment" | "UI design";
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

const ui = (name: string) => ({ name, tier: "interface" as const });
const logic = (name: string) => ({ name, tier: "logic" as const });
const data = (name: string) => ({ name, tier: "data" as const });
const host = (name: string) => ({ name, tier: "hosting" as const });

const jekyll = [ui("Jekyll"), ui("Liquid")];
const pages = [host("GitHub Actions"), host("GitHub Pages")];

export const projects: Project[] = [
  {
    slug: "xnote",
    title: "X Note",
    year: 2026,
    category: "clients",
    kind: "Store",
    summary: "A perfume store for the X Note brand in English and Arabic: a shop sorted by scent family, a page for each of its twelve perfumes in 10, 30 and 50 ml, a cart, a wishlist and an order check.",
    url: "https://xnote-perfume.tech",
    repo: "https://github.com/youssef5511/Xnote",
    sections: shots("xnote", "webp", "Home", "Shop", "Perfume", "Arabic"),
    stack: [ui("HTML"), ui("CSS"), logic("Vanilla JS"), logic("Node build scripts"), data("localStorage"), host("GitHub Pages")],
  },
  {
    slug: "youssuf",
    title: "Youssuf",
    year: 2026,
    category: "clients",
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
    slug: "mori",
    title: "mori",
    year: 2026,
    category: "clients",
    kind: "Website",
    summary: "A public log for mori, a bug hunter climbing from $0 to Diamond: a journey page, write-ups, work and four colour themes. Rebuilt in November from the April version.",
    url: "https://m0r1h4x.github.io",
    repo: "https://github.com/m0r1h4x/m0r1h4x.github.io",
    sections: shots("mori", "webp", "Home", "Journey", "Work", "Posts"),
    stack: [...jekyll, ui("CSS"), logic("Vanilla JS"), data("YAML data"), data("Markdown posts"), ...pages],
  },

  {
    slug: "alkhizanah",
    title: "Al Khizanah",
    year: 2026,
    category: "organizations",
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
  {
    slug: "mnemosyn",
    title: "Mnemosyn",
    year: 2026,
    category: "organizations",
    kind: "Docs",
    summary: "The site and handbook for Mnemosyn, a free 3D atlas of the human central nervous system for students: a guide, downloads, how the atlas is built, and the first landing page.",
    url: "https://mnemo.saeed.cool",
    repo: "https://github.com/anatuphoria/mnemosyn",
    sections: shots("mnemosyn", "webp", "Home", "Guide", "Download", "Landing"),
    stack: [ui("MkDocs"), ui("Material for MkDocs"), logic("Python"), data("Markdown"), data("TOML"), ...pages],
  },
  {
    slug: "ase",
    title: "ase docs",
    year: 2026,
    category: "organizations",
    kind: "Docs",
    summary: "Documentation for ase, my GUI text editor: guides, the spec, the decision records and the roadmap.",
    url: "https://saeeedhany.github.io/ase/",
    repo: "https://github.com/saeeedhany/ase",
    sections: shots("ase", "webp", "Home", "Spec", "Roadmap"),
    stack: [ui("MkDocs"), ui("Material for MkDocs"), data("Markdown"), ...pages],
  },
  {
    slug: "dots",
    title: "dots",
    year: 2025,
    category: "organizations",
    kind: "Website",
    summary: "The site for my Arch Linux setup, drawn as the desktop itself: a dwm bar on top, the README in a terminal, a design page and a blog.",
    url: "https://dots.saeed.cool",
    repo: "https://github.com/saeeedhany/dots",
    sections: shots("dots", "webp", "Home", "Design", "Blog"),
    stack: [ui("HTML"), ui("CSS"), logic("Vanilla JS"), logic("Shell"), host("GitHub Pages")],
  },

  {
    slug: "saeeedhany",
    title: "Saeed Hany",
    year: 2026,
    category: "personal",
    kind: "Website",
    summary: "My own site: essays, a library of book notes and a gallery, in English and Arabic, with manuscript plates dithered into a single ink.",
    url: "https://saeed.cool",
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
    slug: "personal",
    title: "personal",
    year: 2026,
    category: "personal",
    kind: "Website",
    summary: "A plain personal page with a statement of what I want to build, and a second draft beside it.",
    sections: shots("personal", "webp", "Home", "Dede"),
    stack: [ui("HTML"), ui("CSS")],
  },
  {
    slug: "portf",
    title: "portf",
    year: 2026,
    category: "personal",
    kind: "Website",
    summary: "A résumé site: about me, my CLI tools, work, and a blog.",
    sections: shots("portf", "webp", "About", "Projects", "Blog"),
    stack: [ui("HTML"), ui("CSS"), logic("Vanilla JS")],
  },
  {
    slug: "takallam",
    title: "Takallam",
    year: 2026,
    category: "personal",
    kind: "Blog",
    summary: "An Arabic blog with a cultural identity, named for its opening line: تكلم فأنت حر, speak, for you are free.",
    sections: shots("takallam", "webp", "Home"),
    stack: [ui("HTML"), ui("CSS")],
  },
  {
    slug: "sigfault",
    title: "SigFault.log",
    year: 2025,
    category: "personal",
    kind: "Blog",
    summary: "My first blog, about diving beneath abstractions to understand how systems really work.",
    sections: shots("sigfault", "webp", "Home"),
    stack: [ui("HTML"), ui("CSS"), logic("Vanilla JS")],
  },

  {
    slug: "seo-guide",
    title: "SEO Reference Guide",
    year: 2026,
    category: "reference",
    kind: "Docs",
    summary: "An SEO reference in English and Arabic, from the fundamentals to algorithm updates, with checklists, a glossary and downloads.",
    url: "https://saeeedhany.github.io/SEO-RG/",
    repo: "https://github.com/saeeedhany/SEO-RG",
    sections: shots("seo-guide", "webp", "Home", "Overview", "Checklists", "Arabic"),
    stack: [...jekyll, ui("jekyll-seo-tag"), logic("Vanilla JS"), data("YAML data"), data("Markdown chapters"), ...pages],
  },

];
