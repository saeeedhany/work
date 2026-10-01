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

const shots = (slug: string, ...names: string[]): Section[] =>
  names.map((name) => {
    const file = name.toLowerCase();
    return { name, result: `/work/${slug}/${file}-result.svg`, design: `/work/${slug}/${file}-design.svg` };
  });

export const projects: Project[] = [
  {
    slug: "tidepool",
    title: "Tidepool",
    year: 2025,
    kind: "Web app",
    summary: "A tide and swell dashboard that blends nearby stations into one curve per surf spot.",
    url: "https://example.com",
    repo: "https://github.com/",
    sections: shots("tidepool", "Overview", "Spot"),
    stack: [
      { name: "SvelteKit", tier: "interface" },
      { name: "D3", tier: "interface" },
      { name: "TypeScript", tier: "logic" },
      { name: "NOAA API", tier: "data" },
      { name: "SQLite", tier: "data" },
      { name: "Fly.io", tier: "hosting" },
    ],
    sample: true,
  },
  {
    slug: "paperplane",
    title: "Paperplane",
    year: 2024,
    kind: "UI design",
    summary: "A quiet three-pane email client designed around one type scale and one spacing step.",
    sections: shots("paperplane", "Inbox"),
    stack: [
      { name: "Figma", tier: "interface" },
      { name: "CSS tokens", tier: "interface" },
      { name: "Storybook", tier: "logic" },
      { name: "Chromatic", tier: "hosting" },
    ],
    sample: true,
  },
  {
    slug: "loom",
    title: "Loom Market",
    year: 2024,
    kind: "Website",
    summary: "A storefront for four small textile mills, with a cart that lives in the URL.",
    url: "https://example.com",
    sections: shots("loom", "Home", "Product"),
    stack: [
      { name: "Next.js", tier: "interface" },
      { name: "Tailwind", tier: "interface" },
      { name: "React", tier: "logic" },
      { name: "Shopify Storefront API", tier: "data" },
      { name: "Vercel", tier: "hosting" },
    ],
    sample: true,
  },
];
