# CLAUDE.md — Arbejdsprocesser og beslutninger

Dette dokument beskriver de arbejdsproces-beslutninger der er taget for dette projekt.
Opdateres løbende. Gælder for alle Claude-sessioner der arbejder på dette repo.

---

## Repo-struktur

```
RFQ/  (GitHub: matiasbjerre-hub/RFQ)
├── Index.html                        ← RFQ Analyser frontend (GAS template)
├── Kode.js                           ← RFQ Analyser server-side (GAS)
├── Varekatalog.js                    ← Produktdata, CATALOGUE-streng, UI_FIELD_DEFS
├── appsscript.json                   ← GAS manifest
├── .clasp.json                       ← Clasp config (scriptId)
├── .claspignore                      ← Ekskluderer Scand_Website fra GAS push
├── tools/build-catalogue.js          ← Genererer CATALOGUE fra products.js (Fase 1)
├── RFQ_Catalogue_Integration_Spec.md ← Integrationsplan (6 faser)
└── Scand_Website/                    ← Katalog-website (tidligere Rent_Group_Catalogue)
    ├── index.html
    ├── styles.css
    ├── src/                          ← React-komponenter (app.jsx, cart.jsx, components.jsx)
    ├── data/                         ← products.js, packshots.js, i18n.js
    └── assets/packshots/             ← 68+ produktbilleder fra OneDrive
```

---

## Deployment

### RFQ Analyser → Google Apps Script
```bash
cd ~/Documents/RFQ_Analyser
PATH="/opt/homebrew/bin:$PATH" clasp push
```
- Pusher kun de 4 GAS-filer (`.claspignore` holder Scand_Website ude)
- Test på `/dev`-URL'en i GAS
- `APP_VERSION` skal bumpes ved breaking changes (defineret øverst i Kode.js)

### GitHub
```bash
git add <filer>
git commit -m "Beskrivelse\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```
- **Push til GitHub efter hver ændring** — så den anden computer altid kan `git pull`
- Husk `git pull` inden ny session på den anden computer
- Hvis push afvises: `git pull --rebase && git push`

---

## GAS-begrænsninger (vigtigt for Kode.js)

- Brug `var` og klassiske funktioner i server-side kode
- **Ingen literal linjeskift inde i strenge** — brug `\n` escape-sekvenser. Et reelt linjeskift i en streng giver `SyntaxError: Invalid or unexpected token`
- Undgå Unicode-tegn (krøllede anførselstegn `"`, `"` osv.) direkte i kildekoden — brug `String.fromCharCode(8220/8221)` eller erstat dem med ASCII-ækvivalenter
- Ternary-operatorer med komplekse udtryk direkte i objekt-literaler kan give syntaxfejl — byg strenge som separate variabler først
- Python `re.sub` erstatter `\\n` i replacement-strings med reelle linjeskift — brug `lines[i] = ...` direkte i stedet

---

## Projektarkitektur

### To computere
- **Denne Mac** (matiasb.bjerre): Claude Code, clasp installeret, lokal adgang til filer
- **Anden computer**: VS Code terminal, `claude`-kommando, kræver `git pull` først

### Lokale mapper
- `~/Documents/RFQ_Analyser/` er det lokale git-repo (= roden af GitHub-repo'et)
- `~/Documents/RFQ_Analyser/Scand_Website/` er katalog-websitet (omdøbt fra `Rent_Group_Catalogue`)
- Lokale mapper er **nødvendige** for clasp-push til GAS; Scand_Website kan deployes direkte fra GitHub Pages

---

## OneDrive-billeder (packshots)

- OneDrive synkroniseres lokalt under `~/Library/CloudStorage/OneDrive-Deltebiblioteker–PartyRentFranchiseGmbH/Party Rent Denmark - Dokumenter/Photos/`
- **Ingen admin-tilladelse nødvendig** — filerne er tilgængelige direkte
- 62 filer omdøbt med art.nr præfiks (fx `70491 - HAY About a Chair white-Oak.png`)
- Fortryd-fil: `Scand_Website/onedrive_rename_undo.csv`
- Navngivningsprincip: **tilføj** art.nr foran eksisterende navn (slet ikke originalt navn)
- Filerne **bliver i deres mapper** — ingen flytning
- Vælg PNG frem for JPG; undgå filer over 1MB medmindre det er den eneste mulighed
- Matchning er konservativ: kræver produktnavn-overlap i **filnavnet** (ikke kun mappen)

---

## Katalog-website (Scand_Website)

- Statisk React-site via CDN (Babel standalone) — ingen build-step
- Produktdata: `data/products.js` er **eneste kilde** — genererer CATALOGUE til RFQ via `tools/build-catalogue.js`
- Packshots: `assets/packshots/<art>.png` — registreres i `data/packshots.js` under `BY_ART`
- Nye packshots skal tilføjes til `BY_ART` i `packshots.js` for at vises
- Uploads, screenshots og `_packshots_backup/` er ekskluderet fra git (se `.gitignore`)

---

## RFQ Analyser — nøglebeslutninger

### Sprog og tekst
- Dansk som primært sprog, engelsk som sekundært (DA/EN toggle)
- `capFirst()` anvendes på alle felter — første bogstav i hver linje med stort
- Feltetiketter oversættes via `STRINGS`-objekt og `T()`-funktion

### AI-prompts
- Extraction: `claude-opus-4-7`, max 5000 tokens
- Email: `claude-opus-4-7`, max 800 tokens
- Barstole må **aldrig** foreslås til plenum/breakout/grupperum — kun til bar/højbords-opstillinger
- `catalogueComments` må kun indeholde: (1) praktiske usikkerheder og (2) begrundelser for produktvalg
- `catalogueComments` separerer emner med ` — ` (ikke linjeskift)

### Website-tilstand (`?mode=web`)
- Springer email-generering over (sparrer et API-kald)
- Viser kun møbelforslag + manglende oplysninger
- Forespørgsel-felt hedder "Forespørgsel / Brief" i web-tilstand

### Kurv-integration
- Kurv-indhold sendes med som `cartItems`-parameter til `analyseEmail`
- Appenders til email-tekst: `[Kurv paa webshoppen: Nx ProduktNavn Art.XXXXX, ...]`

---

## Installerede skills (denne Mac)

- **UI UX Pro Max** (`~/.claude/skills/ui-ux-pro-max/`) — designvejledning med 67 UI-stilarter, 96 farvepaletter og 57 font-kombinationer. Aktiv automatisk i alle Claude Code-sessioner på denne Mac. Geninstaller på andre computere med: `npm install -g uipro-cli && uipro init --ai claude`

---

## Font og design

- **Montserrat** (Google Fonts) — matcher rent.group hjemmeside
- Body padding: `1.5rem 2.5rem 0`
- Logo: udenfor container, `height: 110px`

---

## Canva-integration

- Design ID: `DAHIyaVvfj8` ("New Catalogue_Scandinavia", 85 sider)
- Canva MCP tilgængeligt i denne session (ikke i cloud-sessioner)
- Batch-eksporter returnerer cached URLs der kan udløbe — brug single-page eksporter og download straks
- Art.nr-diskrepans: Canva bruger `70491` for både HAY AAC White/Oak OG Black/Oak — websitet bruger korrekt `70491` (white) og `70492` (black)

---

## Vigtige fil-stier

| Fil | Formål |
|---|---|
| `Kode.js` | GAS server-side: `doGet`, `analyseEmail`, `callAnthropicAPI` |
| `Varekatalog.js` | `FIELDS`, `CATALOGUE`, `LOCAL_STOCK`, `UI_FIELD_DEFS`, `UI_PRODUCT_DATA` |
| `Index.html` | Frontend: `FIELD_DEFS`, `renderMatrix`, `renderPriceCalc`, `autoFillTimeline` |
| `tools/build-catalogue.js` | Genererer `CATALOGUE`-streng fra `Scand_Website/data/products.js` |
| `RFQ_Catalogue_Integration_Spec.md` | 6-faset integrationsplan (læs denne først i ny session) |
| `Scand_Website/data/products.js` | Eneste kilde til produktdata (334 produkter) |
| `Scand_Website/data/packshots.js` | Mapping: art.nr → billede-sti |
| `Scand_Website/onedrive_rename_undo.csv` | Fortryd-fil for OneDrive omdøbninger |
