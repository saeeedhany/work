import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import type { Project, Tier } from "./data/projects";
import { $, el, media, reduced, loadStatus, finished } from "./ui";

gsap.registerPlugin(Draggable);

const LAYERS = ["result", "design", "stack"] as const;
const TIERS: { tier: Tier; label: string }[] = [
  { tier: "interface", label: "Interface" },
  { tier: "logic", label: "Logic" },
  { tier: "data", label: "Data" },
  { tier: "hosting", label: "Hosting" },
];

let sheets: HTMLElement[] = [];
let cur = 0;
let drags: Draggable[] = [];
let origin: HTMLElement | null = null;
let openSlug: string | null = null;
let onKey: ((e: KeyboardEvent) => void) | null = null;

export const openProject = () => openSlug;

function sheet(i: number, p: Project, body: Node[]) {
  const s = el("article", "sheet");
  s.setAttribute("aria-label", LAYERS[i]);
  const inner = el("div", "sheet-inner");
  const label = el("div", "sheet-label");
  label.append(el("span", undefined, `0${i + 1} / ${LAYERS[i]}`), el("span", undefined, `${p.slug}/${LAYERS[i]}`));
  inner.append(label, ...body);
  s.append(inner);
  return s;
}

function resultSheet(p: Project) {
  const grid = el("div", "result-grid");
  const frame = el("div", "frame");
  frame.append(media(p.sections[0].result, `${p.title}, ${p.sections[0].name}`));
  const meta = el("div", "result-meta");
  const dl = el("dl");
  const row = (k: string, v: Node | string) => { const dd = el("dd"); dd.append(v); dl.append(el("dt", undefined, k), dd); };
  const link = (href: string, text: string) => {
    const a = el("a", undefined, text + " ↗");
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    return a;
  };
  row("kind", p.kind);
  row("year", String(p.year));
  if (p.sections.length > 1) row("pages", p.sections.map((x) => x.name).join(", "));
  row("live", p.url ? link(p.url, p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")) : "not public");
  row("source", p.repo ? link(p.repo, p.repo.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")) : "closed source");
  meta.append(el("h3", undefined, p.title), el("p", undefined, p.summary), dl);
  if (p.sample) meta.append(el("p", "sheet-label", "Sample project: replace it in src/data/projects.ts"));
  grid.append(frame, meta);
  return [grid];
}

function keepGesture(node: HTMLElement) {
  for (const type of ["pointerdown", "mousedown", "touchstart"]) {
    node.addEventListener(type, (e) => e.stopPropagation(), { passive: true });
  }
}

function sweep(cmp: HTMLElement) {
  if (reduced()) return;
  const input = cmp.querySelector("input")!;
  const v = { split: 100 };
  gsap.to(v, {
    split: 50, duration: 1.1, ease: "expo.inOut", delay: 0.15, overwrite: true,
    onUpdate: () => { cmp.style.setProperty("--split", v.split + "%"); input.value = String(v.split); },
  });
}

function designSheet(p: Project) {
  const cmp = el("div", "compare");
  const base = new Image();
  const over = el("div", "over");
  const top = new Image();
  over.append(top);
  const seam = el("div", "seam");
  const input = el("input");
  Object.assign(input, { type: "range", min: "0", max: "100", value: "50" });
  input.setAttribute("aria-label", "Move between wireframe and finished screen");
  input.addEventListener("input", () => cmp.style.setProperty("--split", input.value + "%"));
  cmp.append(base, over, seam, input);
  keepGesture(cmp);

  const legend = el("div", "compare-legend");
  legend.append(el("span", undefined, "← wireframe"), el("span", undefined, "finished screen →"));

  const pages = el("div", "pages");
  pages.setAttribute("role", "group");
  pages.setAttribute("aria-label", "Pages");
  const count = el("span", "pages-count");
  let at = -1;
  const show = (k: number) => {
    if (k === at) return;
    const dir = k > at ? 1 : -1;
    const first = at < 0;
    at = k;
    const sec = p.sections[k];
    base.src = sec.design; base.alt = `${sec.name}, wireframe`;
    top.src = sec.result; top.alt = `${sec.name}, finished`;
    pages.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", String(j === k)));
    count.textContent = `page ${k + 1} of ${p.sections.length}`;
    if (!first && !reduced()) {
      gsap.fromTo(cmp, { x: dir * 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "expo.out" });
      sweep(cmp);
    }
  };
  p.sections.forEach((sec, k) => {
    const b = el("button", undefined, `${sec.name.toLowerCase()}.html`);
    b.type = "button";
    b.addEventListener("click", () => show(k));
    pages.append(b);
  });
  pages.append(count);
  keepGesture(pages);
  show(0);

  const intro = el("p", undefined, "Drag the seam to go from the first wireframe to the shipped screen.");
  return p.sections.length > 1 ? [intro, pages, cmp, legend] : [intro, cmp, legend];
}

function stackSheet(p: Project) {
  const stack = el("div", "stack");
  for (const { tier, label } of TIERS) {
    const items = p.stack.filter((s) => s.tier === tier);
    if (!items.length) continue;
    const row = el("div", "tier");
    const pills = el("div", "pills");
    for (const s of items) pills.append(el("span", "pill", s.name));
    row.append(el("span", "tier-name", label), pills);
    stack.append(row);
  }
  return [stack];
}

function reveal(i: number) {
  if (reduced()) return;
  const s = sheets[i];
  const layer = LAYERS[i];
  if (layer === "result") {
    gsap.from(s.querySelector(".frame"), { scale: 0.97, opacity: 0, duration: 0.6, ease: "expo.out" });
  } else if (layer === "design") {
    sweep(s.querySelector<HTMLElement>(".compare")!);
  } else if (layer === "stack") {
    const r = gsap.utils.random;
    gsap.from(s.querySelectorAll(".pill"), {
      x: () => r(-160, 160), y: () => r(-90, 90), rotation: () => r(-30, 30), opacity: 0,
      stagger: 0.05, duration: 0.8, ease: "back.out(1.5)",
    });
    gsap.fromTo(s.querySelectorAll(".tier"), { "--wire": 0 }, { "--wire": 1, stagger: 0.12, duration: 0.4, delay: 0.4 });
  }
}

const deckWidth = () => $("spDeck").offsetWidth;
const peeled = () => ({ x: -deckWidth() * 1.15, y: -30, rotation: -9 });

function layout(animate: boolean) {
  const dur = animate && !reduced() ? 0.75 : 0;
  sheets.forEach((s, j) => {
    const d = j - cur;
    const top = d === 0;
    s.inert = !top;
    s.setAttribute("aria-hidden", String(!top));
    drags[j]?.[top ? "enable" : "disable"]();
    if (d < 0) {
      gsap.set(s, { zIndex: 20 });
      gsap.to(s, { ...peeled(), autoAlpha: 0, duration: dur, ease: "power3.in", overwrite: true });
    } else {
      gsap.set(s, { zIndex: top ? 20 : 10 - d });
      gsap.to(s, { x: 0, y: d * 12, scale: 1 - d * 0.035, rotation: 0, autoAlpha: 1, duration: dur, ease: "expo.out", overwrite: true });
      gsap.to(s.firstElementChild, { opacity: top ? 1 : 0, duration: dur * 0.6 });
    }
  });
  $("spTabs").querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", String(j === cur)));
  $("spHint").hidden = cur !== 0;
}

function goTo(i: number) {
  const next = Math.min(Math.max(i, 0), sheets.length - 1);
  if (next === cur) return;
  cur = next;
  layout(true);
  reveal(cur);
}
const nextSheet = () => goTo(cur + 1);
const prevSheet = () => goTo(cur - 1);

const ownGesture = (t: Element) => !!t.closest?.("a, button, input, .compare, .pages");

function makeDraggable(s: HTMLElement, j: number) {
  let lastX = 0, lastT = 0, vx = 0;
  const [d] = Draggable.create(s, {
    type: "x",
    allowNativeTouchScrolling: true,
    zIndexBoost: false,
    clickableTest: ownGesture,
    onPress() { lastX = 0; lastT = performance.now(); vx = 0; },
    onDragStart() { s.classList.add("is-dragging"); },
    onDrag() {
      const now = performance.now();
      vx = (this.x - lastX) / Math.max(now - lastT, 1);
      lastX = this.x; lastT = now;
      const x = this.x;
      if (x <= 0) {
        const shown = j === sheets.length - 1 ? x * 0.25 : x;
        gsap.set(s, { x: shown, rotation: shown * 0.025, y: -Math.abs(shown) * 0.04 });
      } else {
        gsap.set(s, { x: x * 0.12, rotation: 0, y: 0 });
        const prev = sheets[j - 1];
        if (prev) {
          const t = Math.min(x / (deckWidth() * 0.9), 1);
          const from = peeled();
          gsap.set(prev, { autoAlpha: 1, x: from.x * (1 - t), y: from.y * (1 - t), rotation: from.rotation * (1 - t) });
          gsap.set(prev.firstElementChild, { opacity: 1 });
        }
      }
    },
    onRelease() {
      s.classList.remove("is-dragging");
      const far = (sign: number) => sign * this.x > deckWidth() * 0.2 || sign * vx > 0.8;
      if (this.x < 0 && far(-1) && j < sheets.length - 1) return nextSheet();
      if (this.x > 0 && far(1) && j > 0) return prevSheet();
      gsap.to(s, { x: 0, y: 0, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.6)" });
      const prev = sheets[j - 1];
      if (prev) gsap.to(prev, { ...peeled(), autoAlpha: 0, duration: 0.4, ease: "power3.in", overwrite: true });
    },
  });
  return d;
}

export function buildSpecimen(p: Project) {
  $("spTitle").textContent = p.slug;
  const deck = $("spDeck");
  sheets = [resultSheet(p), designSheet(p), stackSheet(p)].map((body, i) => sheet(i, p, body));
  deck.replaceChildren(...sheets);
  cur = 0;

  const tabs = $("spTabs");
  tabs.replaceChildren(...LAYERS.map((name, i) => {
    const b = el("button");
    b.type = "button";
    b.append(el("span", "n", `0${i + 1}`), name);
    b.addEventListener("click", () => goTo(i));
    return b;
  }));

  drags = sheets.map((s, j) => makeDraggable(s, j));

  let wheelAcc = 0, wheelLock = 0;
  deck.onwheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    if (performance.now() < wheelLock) return;
    wheelAcc += e.deltaX;
    if (Math.abs(wheelAcc) > 60) {
      wheelAcc > 0 ? nextSheet() : prevSheet();
      wheelAcc = 0;
      wheelLock = performance.now() + 650;
    }
  };
}

function insetFrom(target: HTMLElement | null, box: DOMRect) {
  if (!target) return "inset(40% 40% 40% 40%)";
  const r = target.getBoundingClientRect();
  const c = (v: number) => Math.max(0, v).toFixed(1) + "px";
  return `inset(${c(r.top - box.top)} ${c(box.right - r.right)} ${c(box.bottom - r.bottom)} ${c(r.left - box.left)})`;
}

export function openSpecimen(p: Project, from: HTMLElement | null, animate: boolean): Promise<void> {
  openSlug = p.slug;
  origin = from;
  buildSpecimen(p);
  const spec = $("specimen"), scrim = $("scrim");
  spec.hidden = false;
  scrim.hidden = false;
  $("work").inert = true;
  layout(false);

  onKey = (e) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === "ArrowRight") { e.preventDefault(); nextSheet(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prevSheet(); }
  };
  document.addEventListener("keydown", onKey);

  const done = () => { $("spClose").focus({ preventScroll: true }); };
  if (!animate || reduced()) {
    gsap.set(spec, { clipPath: "none", autoAlpha: 1 });
    gsap.set(scrim, { autoAlpha: 1 });
    done();
    return Promise.resolve();
  }

  loadStatus(`Opening /work/${p.slug}/...`, 0.9);
  const box = spec.getBoundingClientRect();
  const tl = gsap.timeline();
  tl.fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0)
    .fromTo(spec, { clipPath: insetFrom(from, box), autoAlpha: 1 }, { clipPath: "inset(0px 0px 0px 0px)", duration: 0.8, ease: "expo.inOut" }, 0)
    .from(spec.querySelectorAll(".sp-bar > *"), { opacity: 0, y: -6, stagger: 0.06, duration: 0.35 }, 0.5)
    .from([...sheets].reverse(), { y: 60, opacity: 0, stagger: 0.06, duration: 0.6, ease: "expo.out" }, 0.45)
    .set(spec, { clipPath: "none" });
  reveal(0);
  return finished(tl).then(done);
}

export function closeSpecimen(animate: boolean): Promise<void> {
  const spec = $("specimen"), scrim = $("scrim");
  if (spec.hidden) return Promise.resolve();
  if (onKey) document.removeEventListener("keydown", onKey);
  onKey = null;
  const back = origin;
  const finish = () => {
    drags.forEach((d) => d.kill());
    drags = [];
    sheets = [];
    $("spDeck").replaceChildren();
    spec.hidden = true;
    scrim.hidden = true;
    gsap.set(spec, { clearProps: "clipPath,opacity,visibility" });
    $("work").inert = false;
    openSlug = null;
    back?.focus({ preventScroll: true });
  };
  if (!animate || reduced()) { finish(); return Promise.resolve(); }

  const box = spec.getBoundingClientRect();
  const tl = gsap.timeline();
  tl.to(spec.querySelectorAll(".sp-bar > *, .sp-deck, .sp-hint"), { opacity: 0, duration: 0.2 }, 0)
    .fromTo(spec, { clipPath: "inset(0px 0px 0px 0px)" }, { clipPath: insetFrom(back, box), duration: 0.6, ease: "expo.inOut" }, 0.05)
    .to(scrim, { autoAlpha: 0, duration: 0.4 }, 0.25)
    .set(spec, { autoAlpha: 0 });
  return finished(tl).then(() => {
    gsap.set(spec.querySelectorAll(".sp-bar > *, .sp-deck, .sp-hint"), { clearProps: "opacity" });
    finish();
  });
}
