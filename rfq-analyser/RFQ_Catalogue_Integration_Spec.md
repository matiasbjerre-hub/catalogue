# Implementeringsbrief: Integration af Katalog-website + RFQ Analyser

Dette dokument beskriver de ændringer der skal laves i to eksisterende projekter, så
de spiller sammen. Læs hele dokumentet før du begynder. Implementér i faser (Fase 1 → 6)
og verificér hver fase før du går videre.

---

## Baggrund: de to projekter

### Projekt A — RFQ Analyser (Google Apps Script web app)
- **Sti:** `/Users/matiasb.bjerre/Documents/RFQ_Analyser/`
- **Filer:**
  - `Index.html` — frontend (HTML + CSS + browser-JS). Bruger GAS template-syntaks (`<?= ?>`, `<?!= ?>`).
  - `Kode.js` — server-side (svarer til `Kode.gs` i GAS). Kalder Anthropic API.
  - `Varekatalog.js` — indeholder produktdata: `CATALOGUE` (streng), `LOCAL_STOCK`,
    `UI_FIELD_DEFS`, `UI_PRODUCT_DATA`.
  - `appsscript.json` — GAS-manifest.
- **Deployment:** clasp. Push med:
  ```bash
  cd ~/Documents/RFQ_Analyser && PATH="/opt/homebrew/bin:$PATH" clasp push
  ```
- **Sådan virker den i dag:**
  - `doGet()` bygger Index via `createTemplateFromFile("Index")`, sætter `appVersion`,
    `fieldDefsJson`, `productDataJson`, og `setXFrameOptionsMode(ALLOWALL)` (så den KAN embeddes i iframe).
  - `analyseEmail(emailText)` laver TO Anthropic-kald: (1) udtræk af felter + produktforslag,
    (2) generering af email-svar. Returnerer JSON: `{ fields, emailReply, eventDays }`.
  - Frontend: `analyse()` → `google.script.run...analyseEmail(email)` → `onSuccess(data)`
    renderer felt-matrix, prisberegner og email-svar.

### Projekt B — Katalog-website (statisk React-site via CDN)
- **Sti:** `/Users/matiasb.bjerre/Documents/Rent_Group_Catalogue/`
- **Filer:**
  - `index.html` — entry point. Loader React + Babel via CDN, derefter `data/*.js` og `src/*.jsx`.
  - `src/app.jsx`, `src/components.jsx`, `src/cart.jsx` — React-komponenter.
  - `data/products.js` — ALLE produkter (med priser i DKK og packshot-referencer).
  - `data/i18n.js` — oversættelser DA/EN/SV.
  - `data/packshots.js`, `assets/packshots/` — produktbilleder.
  - `styles.css`.
- Kurven sender forespørgsel til `copenhagen@rent.group`.

### VIGTIGE GAS-begrænsninger (Projekt A)
- Server-side kode bruger `var` og klassiske funktioner.
- **Ingen literal linjeskift inde i strenge** — brug `\n` escape-sekvenser. Et reelt linjeskift
  midt i en streng giver `SyntaxError: Invalid or unexpected token`.
- Undgå krøllede anførselstegn (" ") direkte i regex/kildekode — brug `String.fromCharCode(8220/8221)`.

---

## Beslutninger (allerede truffet med brugeren)

1. **Hosting af website:** GitHub Pages på `matiasbjerre-hub.github.io`. Websitet er statisk.
2. **Lagring af forespørgsler:** Ét Google Sheet i Google Drev. Én række pr. forespørgsel.
3. **Notifikation:** ÉN daglig opsamlingsmail til `matiasbjerre@gmail.com` (IKKE pr. forespørgsel).
4. **Domæne:** github.io for nu. `scan.rent.group` evt. senere (kræver firmaets IT).
5. **Én produktliste:** `data/products.js` er den eneste kilde. RFQ'ens `CATALOGUE` skal afledes herfra.
6. **Website-tilstand:** Når RFQ tilgås fra websitet, skal der IKKE foreslås email-svar.
7. **Tale eller skrift:** Kunden kan enten indtale (Web Speech API) eller skrive sin forespørgsel.
8. **Output fra website:** Kun (a) møbelforslag og (b) manglende oplysninger til et tilbud.
9. **Kurv-sync:** Kurvens indhold sendes med ind i analysen. Efter analysen spørges kunden
   "Vil du tilføje de foreslåede møbler til din kurv?" (Ja/Nej).

---

## FASE 1 — Én fælles produktliste

**Mål:** `data/products.js` bliver eneste kilde. RFQ'ens `CATALOGUE`-streng genereres derfra.

1. Undersøg formatet i `Rent_Group_Catalogue/data/products.js` (felter: navn, art.nr, pris, kategori, billede).
2. Skriv et lille Node-script `RFQ_Analyser/tools/build-catalogue.js` der:
   - Indlæser `products.js`.
   - Genererer `CATALOGUE`-strengen i det format RFQ'en forventer (se nuværende `Varekatalog.js`:
     linjer som `"Produktnavn Art.XXXXX DKK 207"`, grupperet under kategori-overskrifter).
   - Skriver resultatet ind i `Varekatalog.js` (erstatter den eksisterende `CATALOGUE`-definition).
   - Bevarer `LOCAL_STOCK`, `UI_FIELD_DEFS`, `UI_PRODUCT_DATA` uændret (medmindre de også skal afledes).
3. Kør scriptet, verificér at `Varekatalog.js` er gyldig, og `clasp push`.

**Verifikation:** RFQ'en kører stadig en normal analyse uden fejl, og produktforslag matcher kataloget.

---

## FASE 2 — Website-tilstand i RFQ Analyser (drop email)

**Mål:** Når RFQ åbnes med `?mode=web`, skjules email-svar og det andet API-kald springes over.

1. **`Kode.js` → `doGet(e)`:**
   - Læs `var mode = (e && e.parameter && e.parameter.mode) ? e.parameter.mode : "";`
   - Sæt `tmpl.mode = mode;` så frontend kender tilstanden.
2. **`Kode.js` → `analyseEmail(emailText, mode)`:**
   - Tilføj parameter `mode`.
   - Hvis `mode === "web"`: SPRING det andet Anthropic-kald (email-generering) over.
     Returnér `emailReply: null`.
3. **`Index.html`:**
   - Modtag `var APP_MODE = "<?= mode ?>";` i browser-JS.
   - I `analyse()`: send mode med: `...analyseEmail(email, APP_MODE)`.
   - I `onSuccess(data)`: hvis `APP_MODE === "web"`, skjul email-sektionen helt og spring
     `WEBSHOP_LINK`-erstatning over. Vis kun matrix (manglende oplysninger) + møbelforslag.

**Verifikation:** Åbn `…/exec?mode=web` → ingen email vises, analysen er hurtigere. Åbn uden
parameter → email vises som før.

---

## FASE 3 — Tale-input (Web Speech API)

**Mål:** En mikrofon-knap ved forespørgselsfeltet i `Index.html`.

1. Tilføj en mikrofon-knap ved siden af tekstfeltet (`#emailIn`).
2. Brug browserens `webkitSpeechRecognition` / `SpeechRecognition`:
   - `recognition.lang` sættes ud fra valgt sprog (da-DK / en-US / sv-SE).
   - Resultatet appendes til `#emailIn`.
   - Vis tydelig "optager…"-tilstand på knappen.
3. Fallback: hvis API ikke findes (fx Safari), skjul knappen — skrift virker altid.

**Verifikation:** I Chrome: klik mikrofon, tal, se teksten dukke op i feltet.

---

## FASE 4 — Lagring i Google Sheet + daglig opsamlingsmail

**Mål:** Hver forespørgsel gemmes som en række. Én daglig mail med link + nye rækker.

1. **Opret regneark én gang:**
   - Funktion `setupStorage()` i `Kode.js` der laver et Sheet via `SpreadsheetApp.create("RFQ Forespørgsler")`,
     gemmer dets ID i `PropertiesService.getScriptProperties()` under nøglen `SHEET_ID`,
     og skriver header-række. (Køres manuelt én gang fra GAS-editoren.)
   - Kolonner: `Tidsstempel | Sprog | Kilde (web/manuel) | Forespørgsel (rå tekst) |
     Møbelforslag | Manglende oplysninger | Kurv-indhold | Emailet (ja/nej)`.
2. **Gem ved hver analyse:**
   - I `analyseEmail`, efter analysen: append en række til Sheet'et med data.
   - Sæt kolonnen `Emailet` til `nej`.
3. **Daglig opsamlingsmail:**
   - Funktion `sendDailyDigest()` der:
     - Finder alle rækker hvor `Emailet = nej`.
     - Hvis ingen: gør intet (send ikke tom mail).
     - Ellers: send ÉN mail via `MailApp.sendEmail()` til `matiasbjerre@gmail.com` med
       (a) link til regnearket (`spreadsheet.getUrl()`) og (b) kort oversigt over nye forespørgsler.
     - Markér de sendte rækker som `Emailet = ja`.
   - Opret en **tidsstyret trigger** (én gang dagligt) — enten via `ScriptApp.newTrigger("sendDailyDigest").timeBased().everyDays(1).atHour(7).create()`
     i en `setupTrigger()`-funktion, eller manuelt i GAS-editorens trigger-UI.
4. **Google Drev til computer:** (brugerens opgave, ikke kode) — installér Google Drive for Desktop
   så regnearket synkroniseres lokalt; kan downloades som CSV når som helst.

**Verifikation:** Kør en analyse → ny række i Sheet. Kør `sendDailyDigest()` manuelt → modtag én
mail med link og oversigt; rækker markeres som emailet; anden kørsel sender ikke igen.

---

## FASE 5 — Embed RFQ i websitet + kurv-sync (postMessage)

**Mål:** Knap på websitet åbner RFQ i et overlay/iframe. Kurv sendes ind. Forslag kan lægges i kurv.

1. **`Rent_Group_Catalogue` (website):**
   - Tilføj knap, fx "Få møbelforslag" / "Get furniture suggestions" / "Få möbelförslag"
     (tilføj nøgle i `data/i18n.js` for alle tre sprog).
   - Knappen åbner et overlay (modal) med en `<iframe>` der peger på RFQ'ens
     deploy-URL med `?mode=web`.
   - **Send kurv ind:** Når iframe'en er klar, send kurvens indhold via
     `iframe.contentWindow.postMessage({type:"cart", items:[...]}, RFQ_ORIGIN)`.
   - **Modtag forslag tilbage:** Lyt på `window.addEventListener("message", ...)`.
     Når RFQ sender `{type:"addToCart", items:[...]}`, opdatér kurven i `cart.jsx`.
   - Brug en konstant `RFQ_ORIGIN` (RFQ'ens script.google.com-origin) og tjek `event.origin`
     i alle message-handlere af sikkerhedshensyn.
2. **`Index.html` (RFQ):**
   - Lyt på `message` fra parent. Ved `{type:"cart"}`: gem kurv-items i en variabel og
     send dem med ind i `analyseEmail` som ekstra kontekst (tilføj parameter `cartItems`).
   - Efter analysen (kun i `mode=web`): vis knappen "Tilføj foreslåede møbler til kurv".
     Ved klik: `parent.postMessage({type:"addToCart", items: suggestedItems}, PARENT_ORIGIN)`.
3. **`Kode.js` → `analyseEmail`:** tilføj `cartItems`-parameter; hvis udfyldt, inkludér
   i prompten ("Kunden har allerede følgende i kurven: …") så forslagene tager højde for det.

**Verifikation:** På websitet: læg varer i kurv → klik "Få møbelforslag" → analysen kender
kurven → vælg "tilføj til kurv" → kurven på websitet opdateres.

---

## FASE 6 — Publicér websitet på GitHub Pages

**Mål:** Websitet ligger offentligt på `matiasbjerre-hub.github.io`.

1. Opret (eller genbrug) et repo til websitet. Bemærk: GitHub Pages forventer enten repo-roden
   eller `/docs`. Hvis det skal ligge på `matiasbjerre-hub.github.io/REPO`, skal interne stier
   være relative (de er det allerede i `index.html`).
2. Push website-filerne, aktivér Pages i repo-Settings (branch: main, mappe: root eller /docs).
3. Verificér at React-appen loader (CDN-scripts kræver internet), billeder vises, sprog virker.
4. Opdatér `RFQ_ORIGIN` / `PARENT_ORIGIN` konstanterne så de matcher den endelige github.io-URL.

**Verifikation:** Besøg den offentlige URL i inkognito → website virker → "Få møbelforslag"
åbner RFQ → fuldt flow virker ende-til-ende.

---

## Rækkefølge og afhængigheder

- Fase 1 og 2 er uafhængige og kan laves først.
- Fase 3 er isoleret (kun frontend).
- Fase 4 kræver intet fra de andre.
- Fase 5 kræver Fase 2 (mode=web).
- Fase 6 kan gøres når websitet ellers er klar; Fase 5's origin-konstanter afhænger af den endelige URL.

## Generelle krav
- Efter hver ændring i RFQ_Analyser: `cd ~/Documents/RFQ_Analyser && PATH="/opt/homebrew/bin:$PATH" clasp push`.
- Commit til Git undervejs.
- Bevar flersprogethed (DA/EN/SV på websitet; DA/EN i RFQ — udvid til SV hvis tid).
- Spørg brugeren ved tvivl om scope før implementering.
