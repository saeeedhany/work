// The plain directory listing, and the preview that blooms out of a row on hover.
import { gsap } from "gsap";
import { projects, type Project } from "./data/projects";
import { $, el, media } from "./ui";

export function renderIndex() {
  const rows = $("rows");
  for (const p of projects) {
    const tr = el("tr");
    tr.dataset.slug = p.slug;

    const name = el("td");
    const a = el("a", "row-link");
    a.href = "#" + p.slug;
    a.append(el("span", "tag", "[DIR]"), `${p.slug}/`);
    name.append(a);
    if (p.sample) name.append(el("span", "sample", "(sample)"));

    const built = p.stack.length > 1 ? `${p.stack[0].name} + ${p.stack.length - 1}` : p.stack[0]?.name ?? "";
    tr.append(
      name,
      el("td", "num", String(p.year)),
      el("td", "col-kind", p.kind),
      el("td", "col-parts", built),
    );
    rows.append(tr);
  }

  const port = location.port || (location.protocol === "https:" ? "443" : "80");
  $("server").textContent = `Served statically at ${location.hostname} Port ${port}`;

  initBloom();
}

export const rowLink = (slug: string) =>
  document.querySelector<HTMLAnchorElement>(`tr[data-slug="${slug}"] .row-link`);

// ---------- hover bloom ----------
let hideBloom = () => {};
export const closeBloom = () => hideBloom();

const BLOOM_PROPS = "clipPath,opacity,visibility,scale";

function initBloom() {
  const fine = matchMedia("(hover: hover) and (min-width: 901px)");
  const bloom = $("bloom");
  const box = $("bloomMedia");
  const url = $("bloomUrl");
  const xTo = gsap.quickTo(bloom, "x", { duration: 0.55, ease: "power3.out" });
  const yTo = gsap.quickTo(bloom, "y", { duration: 0.55, ease: "power3.out" });
  let current: Project | null = null;
  let shown = false;
  let hotRow: HTMLElement | null = null;

  const place = (cx: number, cy: number, jump = false) => {
    const w = bloom.offsetWidth, h = bloom.offsetHeight;
    // sit to the right of the project name, never on top of it
    const nameEnd = hotRow?.firstElementChild?.lastElementChild?.getBoundingClientRect().right ?? 0;
    let x = Math.max(cx, nameEnd) + 40;
    if (x + w > innerWidth - 16) x = cx - w - 32;
    const y = Math.min(Math.max(cy - h / 2, 16), innerHeight - h - 40);
    if (jump) gsap.set(bloom, { x, y });
    xTo(x); yTo(y);
  };

  const show = (p: Project, e: PointerEvent) => {
    if (current !== p) {
      current = p;
      box.replaceChildren(media(p.sections[0].result, ""));
      url.textContent = `${location.host}/work/${p.slug}/`;
      if (shown) gsap.fromTo(box.firstElementChild, { scale: 1.08, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" });
    }
    if (!shown) {
      shown = true;
      place(e.clientX, e.clientY, true);
      // x/y belong to the quickTo follow, so only these properties are ever killed
      gsap.killTweensOf(bloom, BLOOM_PROPS);
      gsap.fromTo(bloom,
        { autoAlpha: 1, clipPath: "inset(50% 100% 50% 0%)", scale: 0.96 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.6, ease: "expo.out" });
    }
  };

  hideBloom = () => {
    hotRow?.classList.remove("is-hot");
    hotRow = null;
    if (!shown) return;
    shown = false;
    current = null;
    gsap.killTweensOf(bloom, BLOOM_PROPS);
    // collapse, fade and settle in one tween so an interrupted open always ends fully hidden
    gsap.to(bloom, {
      clipPath: "inset(50% 0% 50% 100%)", opacity: 0, scale: 1, duration: 0.3, ease: "power3.in",
      onComplete: () => { gsap.set(bloom, { autoAlpha: 0, clipPath: "inset(50% 50% 50% 50%)" }); },
    });
  };

  const rows = $("rows");
  rows.addEventListener("pointermove", (e) => {
    if (!fine.matches || e.pointerType !== "mouse") return;
    const tr = (e.target as Element).closest<HTMLElement>("tr[data-slug]");
    if (!tr) return;
    if (tr !== hotRow) {
      hotRow?.classList.remove("is-hot");
      hotRow = tr;
      tr.classList.add("is-hot");
    }
    const p = projects.find((x) => x.slug === tr.dataset.slug);
    if (p) show(p, e);
    place(e.clientX, e.clientY);
  });
  rows.addEventListener("pointerleave", hideBloom);
  $("work").addEventListener("scroll", hideBloom, { passive: true });
}
