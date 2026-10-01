import { gsap } from "gsap";

export const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
export const reduced = () => reduceQuery.matches;

export function media(src: string, alt: string): HTMLElement {
  if (/\.(mp4|webm)$/i.test(src)) {
    const v = document.createElement("video");
    Object.assign(v, { src, muted: true, loop: true, autoplay: true, playsInline: true });
    v.setAttribute("aria-label", alt);
    return v;
  }
  const img = new Image();
  img.src = src;
  img.alt = alt;
  img.decoding = "async";
  return img;
}

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

const statusText = () => $("statusText");
const meter = () => $("statusMeter");
let loading = false;

export function initStatus() {
  const show = (e: Event) => {
    const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
    if (a && !loading) statusText().textContent = a.href;
  };
  const clear = (e: Event) => {
    if ((e.target as Element).closest?.("a[href]") && !loading) statusText().textContent = "Done";
  };
  document.addEventListener("pointerover", show);
  document.addEventListener("pointerout", clear);
  document.addEventListener("focusin", show);
  document.addEventListener("focusout", clear);
}

export function loadStatus(message: string, seconds: number) {
  loading = true;
  statusText().textContent = message;
  gsap.killTweensOf(meter());
  gsap.fromTo(meter(), { width: "0%" }, {
    width: "100%", duration: Math.max(seconds, 0.2), ease: "power1.inOut",
    onComplete() {
      loading = false;
      statusText().textContent = "Done";
      gsap.set(meter(), { width: "0%" });
    },
  });
}

export const finished = (tl: gsap.core.Timeline) =>
  new Promise<void>((resolve) => tl.eventCallback("onComplete", () => resolve()));
