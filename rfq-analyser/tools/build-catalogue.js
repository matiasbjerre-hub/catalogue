#!/usr/bin/env node
// Fase 1: Genererer CATALOGUE fra products.js og skriver den direkte ind i Varekatalog.js
// Kør fra rfq-mappen: node tools/build-catalogue.js [sti-til-products.js]

const path = require("path");
const fs   = require("fs");

const productsPath    = process.argv[2] ||
  path.join(__dirname, "..", "..", "repo", "project", "data", "products.js");
const varekatalogPath = path.join(__dirname, "..", "Varekatalog.js");

// Simulér window-objekt og eval products.js
const window = {};
eval(fs.readFileSync(productsPath, "utf8"));

const CATEGORIES_MAP = {
  "chairs/dinner":     "STOLE (Dinner & Conference)",
  "chairs/bar":        "BARSTOLE",
  "tables/high":       "HØJE BORDE & BARBORDE",
  "tables/dinner":     "SPISE- & BISTROBORDE",
  "tables/lounge":     "LOUNGEBORDE og side tables",
  "lounge/sofas":      "LOUNGEMØBLER - LÆNESTOLE & SOFAER",
  "lounge/poufs":      "Puffer",
  "lounge/outdoor":    "UDENDØRS LOUNGE",
  "bars/":             "BAR & RECEPTION",
  "shelving/":         "REOLER",
  "carpets/carpets":   "GULVTÆPPER",
  "carpets/pillows":   "PUDER",
  "lighting/":         "BELYSNING",
  "plants/":           "PLANTER",
  "misc/":             "DIVERSE",
  "tableware/china":   "SERVICE - PORCELÆN",
  "tableware/cutlery": "SERVICE - BESTIK",
  "tableware/glasses": "SERVICE - GLAS",
  "tableware/serving": "SERVICE - SERVERING",
  "kitchen/":          "KØKKENUDSTYR",
};

function formatName(name)    { return name.replace(" — ", " ").replace(" - ", " "); }
function formatVariant(v)    { return v.replace(/ \/ /g, "/"); }

const groups = {};
for (const p of window.PRODUCTS) {
  const key = p.sub ? `${p.cat}/${p.sub}` : `${p.cat}/`;
  if (!groups[key]) groups[key] = [];
  groups[key].push(p);
}

const lines = [];
for (const key of Object.keys(CATEGORIES_MAP)) {
  const products = groups[key];
  if (!products || products.length === 0) continue;
  lines.push(CATEGORIES_MAP[key] + ":");
  for (const p of products) {
    const price = p.price != null ? `DKK ${p.price}` : "DKK (pris mangler)";
    lines.push(`${formatName(p.name)} ${formatVariant(p.variant)} Art.${p.art} ${price}`);
  }
  lines.push("");
}
while (lines.length && lines[lines.length - 1] === "") lines.pop();

const catalogue = lines.join("\n");

// Escaping til template literal i Varekatalog.js
const escaped = catalogue.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

let src = fs.readFileSync(varekatalogPath, "utf8");
const BT = "`";
const re = new RegExp("const CATALOGUE = " + BT + "[^" + BT + "]*" + BT, "s");

if (!re.test(src)) {
  console.error("FEJL: Fandt ikke CATALOGUE-konstanten i Varekatalog.js");
  process.exit(1);
}

const updated = src.replace(re, "const CATALOGUE = " + BT + escaped + BT);

if (updated === src) {
  console.log(`✓ CATALOGUE allerede opdateret: ${catalogue.split("\n").length} linjer, ${window.PRODUCTS.length} produkter (ingen ændringer)`);
} else {
  fs.writeFileSync(varekatalogPath, updated, "utf8");
  console.log(`✓ CATALOGUE opdateret: ${catalogue.split("\n").length} linjer, ${window.PRODUCTS.length} produkter`);
  console.log(`  → ${varekatalogPath}`);
}
