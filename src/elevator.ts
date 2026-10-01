// The two floors: /work and /contact. Moving between them is one vertical
// "elevator drop": the work slab rises out as a single piece while the
// contact floor arrives from below with a small overshoot.
import { gsap } from "gsap";
import { site } from "./data/site";
import { $, el, reduced, loadStatus, finished } from "./ui";

const work = () => $("work");
const contact = () => $("contact");
let onContact = false;
let tl: gsap.core.Timeline | null = null;

export const isOnContact = () => onContact;

export function initContact() {
  const email = $<HTMLAnchorElement>("email");
  email.href = "mailto:" + site.email;
  email.setAttribute("aria-label", site.email);
  // one span per character so the address can arrive letter by letter
  for (const ch of site.email) email.append(el("span", "ch", ch));

  const list = $("elsewhere");
  for (const l of site.links) {
    const li = el("li");
    const a = el("a", l.struck ? "struck" : undefined, l.label);
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener";
    if (l.struck) {
      // crossed out: the profile exists but has nothing on it yet
      a.setAttribute("aria-label", `${l.label} (nothing posted yet)`);
      a.append(el("span", "strike"));
      li.append(a, el("span", "why", "(nothing here yet)"));
    } else li.append(a);
    list.append(li);
  }

  const status = $("copyStatus");
  $("copyBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      status.textContent = "copied to clipboard";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(email);
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
      status.textContent = "selected: press Ctrl+C / ⌘C";
    }
    gsap.fromTo(status, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.25 });
  });

  gsap.set(contact(), { y: 0, yPercent: 100, autoAlpha: 0 });
  contact().inert = true;
}

export function toContact(animate: boolean): Promise<void> {
  onContact = true;
  tl?.kill();
  work().inert = true;
  contact().inert = false;
  const chars = contact().querySelectorAll(".email .ch");
  const rest = contact().querySelectorAll(".path, .copy-row, .elsewhere li, hr, p:last-child");

  if (!animate || reduced()) {
    gsap.set(work(), { yPercent: -100, autoAlpha: 0, filter: "none" });
    gsap.set(contact(), { yPercent: 0, autoAlpha: 1 });
    gsap.set([chars, rest], { clearProps: "all" });
    if (animate) gsap.from(contact(), { opacity: 0, duration: 0.3 });
    return Promise.resolve();
  }

  loadStatus("Opening page /contact...", 1.1);
  tl = gsap.timeline();
  tl.set(contact(), { autoAlpha: 1, yPercent: 100 })
    .to(work(), { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, 0)
    .to(work(), { filter: "blur(5px)", duration: 0.45, ease: "power2.in", yoyo: true, repeat: 1 }, 0)
    .to(contact(), { yPercent: 0, duration: 1.05, ease: "back.out(1.15)" }, 0.12)
    .from(chars, { yPercent: 90, opacity: 0, rotation: 6, stagger: 0.018, duration: 0.7, ease: "expo.out" }, 0.5)
    .from(rest, { y: 16, opacity: 0, stagger: 0.05, duration: 0.5, ease: "power2.out" }, 0.75)
    .fromTo(contact().querySelectorAll(".strike"), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, 1.25)
    .set(work(), { autoAlpha: 0, filter: "none" });
  return finished(tl).then(() => { $("email").focus({ preventScroll: true }); });
}

export function toWork(animate: boolean): Promise<void> {
  onContact = false;
  tl?.kill();
  work().inert = false;
  contact().inert = true;

  if (!animate || reduced()) {
    gsap.set(work(), { yPercent: 0, autoAlpha: 1, filter: "none" });
    gsap.set(contact(), { yPercent: 100, autoAlpha: 0 });
    if (animate) gsap.from(work(), { opacity: 0, duration: 0.3 });
    return Promise.resolve();
  }

  loadStatus("Opening page /work...", 1);
  tl = gsap.timeline();
  tl.set(work(), { autoAlpha: 1, yPercent: -100 })
    .to(contact(), { yPercent: 100, duration: 0.85, ease: "power3.inOut" }, 0)
    .to(contact(), { filter: "blur(5px)", duration: 0.42, ease: "power2.in", yoyo: true, repeat: 1 }, 0)
    .to(work(), { yPercent: 0, duration: 1, ease: "back.out(1.1)" }, 0.1)
    .set(contact(), { autoAlpha: 0, filter: "none" });
  return finished(tl).then(() => { $("contactLink").focus({ preventScroll: true }); });
}
