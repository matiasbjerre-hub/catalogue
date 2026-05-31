# Produktkatalog website

_Started 2026-05-24 19:39 UTC_

---

## User

Jeg vil gerne omdanne et produktkatalog til en hjemmeside. Er det bedste at jeg uploader en PDF eller er adgang til filen i Canva bedre?

## Assistant

Hej! Godt spørgsmål — begge dele kan fungere, men de har forskellige styrker:

**PDF (anbefales typisk)**
- ✅ Hurtigt og pålideligt — jeg kan læse tekst, layout og se billeder direkte
- ✅ Bevarer typografi og struktur præcist som det ser ud nu
- ✅ Nemt at referere til specifikke sider undervejs
- ⚠️ Billeder skal evt. eksporteres separat hvis du vil have dem i høj opløsning på sitet

**Canva-fil (link eller eksport)**
- ✅ Hvis designet stadig udvikles, eller du vil have adgang til de originale assets (logoer, billeder, fonte)
- ✅ Du kan eksportere individuelle elementer i høj kvalitet
- ⚠️ Jeg kan ikke åbne Canva direkte — du skal eksportere som PDF eller billeder alligevel
- ⚠️ Et delt Canva-link kræver typisk login

**Min anbefaling:** 👉 **Upload PDF'en** som udgangspunkt — det er den hurtigste vej til at komme i gang. Hvis vi senere har brug for skarpe produktbilleder eller logoer i original kvalitet, kan du supplere med PNG/JPG-eksporter fra Canva.

**Et par ting jeg gerne vil vide før vi går i gang:**

1. **Omfang** — hvor mange produkter/sider er der i kataloget?
2. **Formål** — skal det være en ren præsentations-side, eller skal folk kunne købe/bestille/kontakte?
3. **Eksisterende brand** — har I en hjemmeside, logo-filer, eller brand guidelines jeg skal matche?
4. **Målgruppe** — B2B (forhandlere, indkøbere) eller B2C (forbrugere)?
5. **Sprog** — dansk, engelsk, begge dele?

Når du har uploadet PDF'en, kigger jeg den igennem og kommer tilbage med et par retningsforslag før vi bygger noget. 🚀

## User

1. 85 sider
2. Både åræsentation og kunder skal kunde tilføje produkter til en indkøbskurv som sendes til copenhagen@rent.group
3. Hjemmesiden er: party.rent 
4. Kunderne er 95% B2B og 5% B2C
5. Dansk, engelsk og svensk

Priser skal være danske priser i DKK

## Assistant

_[tool: list_files]_

_[tool: view_image]_

_[tool: invoke_skill]_

_[tool: list_files]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: update_todos]_

Tak — det er rigeligt at gå i gang med. Jeg har læst hele kataloget (85 sider, masser af produkter på tværs af stole, borde, lounge, bars, tæpper, belysning, planter, service og køkkenudstyr) og vil bygge en interaktiv prototype med:

- **Editorial, skandinavisk æstetik** der passer til brandet (varm off-white, sort, fersken-accent fra logoet)
- **Kategori-navigation** og produktkort
- **Indkøbskurv** der opsamler produkter og sender forespørgsel til copenhagen@rent.group
- **Sprogskifter** (DA/EN/SV)
- **Tweaks** så du kan eksperimentere med stil

Jeg laver et eget originalt design — ikke en kopi af jeres nuværende party.rent-site. Lad mig bygge fundamentet.

_[tool: copy_files]_

_[tool: copy_starter_component]_

_[tool: write_file]_

Now I'll build the data layer. Let me write the products file with a curated set across all 11 categories.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: done]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: update_todos]_

The site renders cleanly. Let me hand off to the verifier and brief you.

_[tool: fork_verifier_agent]_

Færdig — første udkast af **Party.Rent Denmark** som interaktiv prototype er klar.

**Hvad er bygget**
- **Editorial skandinavisk æstetik** — varm off-white papir, sort, fersken-accent fra dit logo, Bricolage Grotesque til displays, Inter til UI
- **11 kategorier**, ~190 produkter på tværs af stole, borde, lounge, barer, reoler, tæpper, belysning, planter, diverse, service og køkken — med farver, mål og vare-numre fra kataloget
- **Indkøbskurv-flow i 3 trin**: kurv → event-detaljer (dato, gæster, lokation) → kontakt → bekræftelse med reference-nr. Forespørgslen "sendes" til copenhagen@rent.group (lige nu simuleret + gemt i localStorage — skal kobles på en backend før produktion)
- **3 sprog**: DA/EN/SV med øjeblikkelig skift via toggle. Alle priser i DKK med moms-note (1. dag liste, dag 2: 25%, dag 3+: 15%)
- **Søgning + sub-kategori-filtre** (fx Middag/Bar inde i Stole)
- **Tweaks** (toolbar-toggle): accent-farve, vis/skjul hero-billede, vis/skjul stats

**Hvad mangler / næste skridt**
- **Rigtige produktbilleder** — alle kort har stiliserede silhuet-placeholders (kategori-specifikke ikoner + farvet baggrund pr. produktfarve). Når du har billed-eksporter fra Canva eller produktfoto-banken, slotter de direkte ind
- **Backend** der faktisk mailer ordrer til copenhagen@rent.group (eller hooker til jeres CRM/Salesforce/HubSpot)
- **Konsoliderede SKU-varianter** — i kataloget optræder samme produkt i flere farver som separate kort; vi kan smelte dem til ét kort med farve-vælger hvis ønsket
- Skal jeg lave **variationer** af hero-stil (fx mere foto-baseret, mere minimalistisk, mere "event-energi"), eller dykke videre ned i produktdetalje-side / inspirations-galleri?

