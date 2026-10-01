import { mkdirSync, writeFileSync } from "node:fs";

const W = 1200, H = 800;

const box = (x, y, w, h, fill, r = 8) => ({ t: "box", x, y, w, h, fill, r });
const img = (x, y, w, h, fill, r = 8) => ({ t: "img", x, y, w, h, fill, r });
const text = (x, y, w, size, fill, str) => ({ t: "text", x, y, w, size, fill, str });
const line = (d, stroke, width = 3) => ({ t: "line", d, stroke, width });
const dot = (cx, cy, r, fill) => ({ t: "dot", cx, cy, r, fill });

function draw(shapes, mode) {
  const wf = mode === "design";
  const out = [];
  for (const s of shapes) {
    if (s.t === "box") {
      out.push(wf
        ? `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="none" stroke="#9aa0a6" stroke-width="2"/>`
        : `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${s.fill}"/>`);
    } else if (s.t === "img") {
      out.push(wf
        ? `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="none" stroke="#9aa0a6" stroke-width="2"/>` +
          `<path d="M${s.x} ${s.y}L${s.x + s.w} ${s.y + s.h}M${s.x + s.w} ${s.y}L${s.x} ${s.y + s.h}" stroke="#c4c8cc" stroke-width="1.5"/>`
        : `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${s.fill}"/>`);
    } else if (s.t === "text") {
      out.push(wf
        ? `<rect x="${s.x}" y="${s.y - s.size * 0.75}" width="${s.w}" height="${s.size * 0.7}" rx="3" fill="#dfe2e5"/>`
        : `<text x="${s.x}" y="${s.y}" font-family="Helvetica, Arial, sans-serif" font-size="${s.size}" font-weight="${s.size > 22 ? 700 : 400}" fill="${s.fill}">${s.str}</text>`);
    } else if (s.t === "line") {
      out.push(wf
        ? `<path d="${s.d}" fill="none" stroke="#9aa0a6" stroke-width="2" stroke-dasharray="8 6"/>`
        : `<path d="${s.d}" fill="none" stroke="${s.stroke}" stroke-width="${s.width}" stroke-linecap="round"/>`);
    } else if (s.t === "dot") {
      out.push(wf
        ? `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="none" stroke="#9aa0a6" stroke-width="2"/>`
        : `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${s.fill}"/>`);
    }
  }
  return out.join("\n");
}

function svg(bg, shapes, mode) {
  const ground = mode === "design" ? "#ffffff" : bg;
  const grid = mode === "design"
    ? `<defs><pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#eef0f2" stroke-width="1"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="${ground}"/>${grid}
${draw(shapes, mode)}
</svg>
`;
}

const wave = (y0, amp, phase) => {
  let d = `M340 ${y0}`;
  for (let x = 340; x <= 1140; x += 20) d += ` L${x} ${(y0 + Math.sin((x + phase) / 70) * amp + Math.sin((x + phase) / 23) * amp * 0.2).toFixed(1)}`;
  return d;
};
const tidepool = {
  bg: "#0d1b2a",
  shapes: [
    box(0, 0, 280, H, "#10243a", 0),
    text(40, 70, 150, 28, "#e0f2ff", "tidepool"),
    ...["Overview", "Tides", "Swell", "Wind", "Spots"].map((s, i) => text(40, 150 + i * 48, 110, 18, i === 0 ? "#7fdbff" : "#6d8aa6", s)),
    text(340, 80, 360, 34, "#e0f2ff", "Pacifica, 06:40"),
    text(340, 115, 260, 18, "#6d8aa6", "Rising tide · 1.4 m by 09:12"),
    box(340, 160, 800, 330, "#132f4c", 14),
    line(wave(330, 70, 0), "#7fdbff", 4),
    line(wave(360, 40, 90), "#2e6f9e", 3),
    dot(740, 300, 9, "#ffd166"),
    ...[0, 1, 2].map(i => box(340 + i * 275, 520, 250, 200, "#132f4c", 14)),
    text(370, 580, 120, 18, "#6d8aa6", "Swell"), text(370, 650, 140, 52, "#e0f2ff", "2.1m"),
    text(645, 580, 120, 18, "#6d8aa6", "Period"), text(645, 650, 140, 52, "#e0f2ff", "13s"),
    text(920, 580, 120, 18, "#6d8aa6", "Wind"), text(920, 650, 160, 52, "#e0f2ff", "6kt"),
  ],
};

const paperplane = {
  bg: "#f6f3ee",
  shapes: [
    box(0, 0, 220, H, "#ece6dc", 0),
    text(32, 64, 130, 26, "#2b2b2b", "paperplane"),
    box(32, 100, 156, 44, "#2b2b2b", 22), text(66, 129, 90, 17, "#f6f3ee", "Compose"),
    ...["Inbox", "Later", "Sent", "Archive"].map((s, i) => text(40, 200 + i * 44, 90, 17, i === 0 ? "#2b2b2b" : "#8a8277", s)),
    box(220, 0, 380, H, "#fbf9f5", 0),
    ...[0, 1, 2, 3, 4, 5].map(i => box(236, 24 + i * 120, 348, 104, i === 1 ? "#efe7d8" : "#fbf9f5", 10)),
    ...[0, 1, 2, 3, 4, 5].flatMap(i => [
      dot(270, 64 + i * 120, 18, ["#e07a5f", "#81b29a", "#f2cc8f", "#3d405b", "#e07a5f", "#81b29a"][i]),
      text(302, 62 + i * 120, 180, 18, "#2b2b2b", ["Studio notes", "Invoice #0412", "Type specimens", "Weekend plans", "Re: the grid", "Proofs ready"][i]),
      text(302, 92 + i * 120, 250, 15, "#8a8277", "Short preview of the message…"),
    ]),
    text(650, 90, 420, 34, "#2b2b2b", "Invoice #0412"),
    text(650, 128, 300, 16, "#8a8277", "From accounts · 2 attachments"),
    ...[0, 1, 2, 3, 4, 5, 6].map(i => text(650, 200 + i * 34, i === 6 ? 260 : 480, 17, "#4a4640", "Thanks for the quick turnaround on the last batch.")),
    img(650, 470, 230, 150, "#e8dfd0", 10), img(900, 470, 230, 150, "#dcd3c2", 10),
    box(650, 670, 480, 64, "#fbf9f5", 32), text(680, 709, 200, 17, "#8a8277", "Reply…"),
  ],
};

const loom = {
  bg: "#fffaf3",
  shapes: [
    text(60, 64, 150, 28, "#1f3d2b", "loom market"),
    ...["Shop", "Makers", "Journal", "Cart (2)"].map((s, i) => text(760 + i * 100, 62, 80, 17, "#1f3d2b", s)),
    img(60, 110, 1080, 300, "#c9d8c5", 16),
    text(110, 250, 500, 48, "#1f3d2b", "Woven slowly."),
    text(110, 295, 360, 20, "#3e5c49", "Autumn throws from four small mills"),
    box(110, 325, 150, 46, "#1f3d2b", 23), text(148, 354, 80, 17, "#fffaf3", "Shop now"),
    ...[0, 1, 2, 3].flatMap(i => [
      img(60 + i * 276, 450, 252, 230, ["#e9c9a8", "#b9c7d6", "#d8b4a0", "#c3cfb4"][i], 12),
      text(60 + i * 276, 716, 180, 18, "#1f3d2b", ["Ridge throw", "Tide blanket", "Clay runner", "Moss cushion"][i]),
      text(60 + i * 276, 746, 70, 17, "#3e5c49", ["$180", "$220", "$95", "$64"][i]),
    ]),
  ],
};

const tideCurve = () => {
  let d = "M80 520";
  for (let x = 80; x <= 1120; x += 20) d += ` L${x} ${(470 + Math.sin((x - 80) / 165) * 110).toFixed(1)}`;
  return d;
};
const tidepoolSpot = {
  bg: "#0d1b2a",
  shapes: [
    text(80, 80, 120, 18, "#6d8aa6", "← Spots"),
    text(80, 140, 360, 44, "#e0f2ff", "Linda Mar"),
    text(80, 178, 320, 18, "#6d8aa6", "Beach break · best on a rising mid tide"),
    box(860, 100, 260, 100, "#132f4c", 14),
    text(890, 140, 120, 16, "#6d8aa6", "Now"), text(890, 180, 160, 34, "#ffd166", "1.4 m"),
    box(80, 240, 1040, 420, "#132f4c", 14),
    line(tideCurve(), "#7fdbff", 4),
    ...[0, 1, 2, 3, 4, 5, 6].map(i => text(110 + i * 160, 640, 50, 15, "#6d8aa6", String(i * 4).padStart(2, "0") + ":00")),
    dot(440, 384, 10, "#ffd166"),
    ...[0, 1, 2].map(i => box(80 + i * 355, 690, 330, 70, "#132f4c", 12)),
    ...["Low 03:12 · 0.3 m", "High 09:12 · 1.8 m", "Low 15:40 · 0.4 m"].map((t, i) => text(105 + i * 355, 733, 260, 18, "#e0f2ff", t)),
  ],
};

const loomProduct = {
  bg: "#fffaf3",
  shapes: [
    text(60, 64, 150, 28, "#1f3d2b", "loom market"),
    ...["Shop", "Makers", "Journal", "Cart (2)"].map((s, i) => text(760 + i * 100, 62, 80, 17, "#1f3d2b", s)),
    img(60, 110, 560, 640, "#e9c9a8", 16),
    text(680, 170, 120, 16, "#3e5c49", "Ridgeline Mill"),
    text(680, 230, 440, 46, "#1f3d2b", "Ridge throw"),
    text(680, 280, 100, 24, "#1f3d2b", "$180"),
    ...["#e9c9a8", "#b9c7d6", "#3e5c49"].map((c, i) => dot(700 + i * 50, 340, 16, c)),
    ...[0, 1, 2, 3].map(i => text(680, 410 + i * 30, i === 3 ? 260 : 420, 17, "#3e5c49", "Lambswool, woven on a 1960s dobby loom.")),
    box(680, 560, 440, 56, "#1f3d2b", 28), text(840, 595, 160, 18, "#fffaf3", "Add to cart"),
    text(680, 680, 300, 15, "#3e5c49", "Ships from Wales in 3–5 days"),
  ],
};

const screens = {
  tidepool: { overview: tidepool, spot: tidepoolSpot },
  paperplane: { inbox: paperplane },
  loom: { home: loom, product: loomProduct },
};

for (const [slug, list] of Object.entries(screens)) {
  mkdirSync(`public/work/${slug}`, { recursive: true });
  for (const [name, p] of Object.entries(list)) {
    writeFileSync(`public/work/${slug}/${name}-result.svg`, svg(p.bg, p.shapes, "result"));
    writeFileSync(`public/work/${slug}/${name}-design.svg`, svg(p.bg, p.shapes, "design"));
  }
}
console.log("sample visuals written to public/work/");
