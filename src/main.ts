// Routing is just the URL hash:  (none) = the index,  #contact,  #<slug> = an open project.
// Every change goes through one queue so transitions never overlap.
import { projects } from "./data/projects";
import { renderIndex, rowLink, closeBloom } from "./index-list";
import { initContact, toContact, toWork, isOnContact } from "./elevator";
import { openSpecimen, closeSpecimen, openProject } from "./specimen";
import { $, initStatus } from "./ui";

type Route = { name: "index" } | { name: "contact" } | { name: "project"; slug: string };

function parse(): Route {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h === "contact") return { name: "contact" };
  if (projects.some((p) => p.slug === h)) return { name: "project", slug: h };
  return { name: "index" };
}

let route: Route = { name: "index" };
let queue = Promise.resolve();
let cameFromIndex = false; // true when Back would land on the index

async function apply(next: Route, animate: boolean) {
  closeBloom();
  if (openProject() && !(next.name === "project" && next.slug === openProject())) {
    await closeSpecimen(animate);
  }
  if (next.name === "contact" && !isOnContact()) await toContact(animate);
  if (next.name !== "contact" && isOnContact()) await toWork(animate);
  if (next.name === "project" && openProject() !== next.slug) {
    const p = projects.find((x) => x.slug === next.slug)!;
    await openSpecimen(p, rowLink(p.slug), animate);
  }
  route = next;
}

const go = (next: Route, animate: boolean) => { queue = queue.then(() => apply(next, animate)).catch(console.error); };

/** Return to the index: use real history when we came from it, so Back/Forward stay honest. */
function leave() {
  if (cameFromIndex) {
    history.back();
  } else {
    history.replaceState(null, "", location.pathname + location.search);
    go({ name: "index" }, true);
  }
}

addEventListener("hashchange", () => {
  const next = parse();
  cameFromIndex = route.name === "index" && next.name !== "index" ? true : next.name === "index" ? false : cameFromIndex;
  go(next, true);
});

renderIndex();
initContact();
initStatus();

$("spClose").addEventListener("click", leave);
$("scrim").addEventListener("click", leave);
$("backLink").addEventListener("click", (e) => { e.preventDefault(); leave(); });
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && (openProject() || isOnContact())) leave();
});

go(parse(), false);
