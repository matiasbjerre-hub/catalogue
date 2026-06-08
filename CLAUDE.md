# Catalogue — Claude arbejdsregler

> **Dette repo er den ENESTE kilde til katalog-websitet.** Kildefilerne ligger i `project/`
> (`data/products.js`, `data/packshots.js`, `src/*.jsx`, `styles.css`, `assets/packshots/`).
> Den gamle `RFQ/Scand_Website`-kopi er nedlagt (juni 2026) — arbejd ALDRIG i den.
> RFQ Analyser (Google Apps Script) er sit eget separate produkt i `matiasbjerre-hub/RFQ`.

## Start af hver session
Kør altid dette før noget andet — uanset maskine eller session:
```bash
git pull origin main
```
Derved er CLAUDE.md og alle kildefiler altid opdaterede fra starten.

## Git-workflow
- Push direkte til `main` — ingen PRs, ingen feature branches
- Enkeltudvikler-projekt, PR-workflow giver ingen værdi her

## Den bundlede HTML
`project/Rent.Group Catalogue.html` er en selvstændig bundlet fil med egne indlejrede kopier af alle JS- og CSS-filer. Den skal opdateres manuelt med Python når kildefilerne ændres:

```python
import json, base64, gzip

with open('project/Rent.Group Catalogue.html', 'r') as f:
    lines = f.readlines()

manifest = json.loads(lines[172])

# UUID-oversigt (vigtigste filer):
# b5d7eb32 = data/i18n.js
# 5763f64e = src/app.jsx
# 3ccd02f2 = src/cart.jsx
# 55c5b3c3 = src/components.jsx
# 7f09bb83 = data/products.js

def encode(path):
    return base64.b64encode(gzip.compress(open(path, 'rb').read())).decode()

manifest['b5d7eb32-4d4c-4c23-b592-d03769f2fcdd']['data'] = encode('project/data/i18n.js')
manifest['5763f64e-d129-42f2-8e98-1327219241fa']['data'] = encode('project/src/app.jsx')
# osv.

lines[172] = json.dumps(manifest) + '\n'
# CSS ændringer: opdater inline <style> i lines[180] (template JSON)

with open('project/Rent.Group Catalogue.html', 'w') as f:
    f.writelines(lines)
```

## GitHub Pages
Sitet `https://matiasbjerre-hub.github.io/catalogue/` serverer fra rod-`index.html` på `main`, som loader kildefilerne fra `project/` direkte. Hard refresh (Ctrl/Cmd+Shift+R) rydder browser-cache. Pages genbygger ~1-5 min efter push.

## Packshots
- Filer: `project/assets/packshots/<art>.(png|jpg)` — registreres i `project/data/packshots.js` under `BY_ART` for at vises. `project/data/products.js` er eneste produktkilde.
- **Størrelses-normalisering (Prisma-stil):** hvert produktbillede beskæres til sin bounding-box, placeres på et 800×800 hvidt lærred i ~86% højde, bundjusteret på en fælles gulvlinje (centreret vandret, bundmargen ~4.5%). Giver ensartet produktstørrelse pr. kategori. **Tableware undtages bevidst** (allerede balanceret). En sikkerhedsvagt springer over ved fejldetektion på hvid-på-hvid (skip hvis bbox < 6%).
- Kort/CSS: `.card__photo` bruger `object-fit: contain; object-position: center bottom`.

### Billedkilder (når et packshot mangler)
1. **Party Rent webshop:** `https://www.party.rent/storage/products/<art>.jpg` (rent enkeltprodukt på hvid; 404 hvis art.nr ikke findes). Lokale PRDK-numre (194xxx/195xxx/193xxx/1972xxx) findes typisk IKKE her.
2. **OneDrive Photos:** `~/Library/CloudStorage/OneDrive-Deltebiblioteker–PartyRentFranchiseGmbH/Party Rent Denmark - Dokumenter/Photos/` — organiseret efter møbeltype; filer ofte navngivet `<art> - navn.ext`.
3. **Canva — "New Catalogue_Scandinavia"** (design-ID `DAHIyaVvfj8`): det lokale DKK-katalog med art.nr + navn + mål. Canva kan kun eksportere hele SIDER (PNG op til 3840px) — beskær enkeltprodukter ud med Pillow. Mange celler viser et Rent.Group-LOGO = intet packshot findes.
- Art.nr-diskrepans: Canva bruger `70491` for både HAY AAC White/Oak OG Black/Oak — websitet bruger korrekt `70491` (white) og `70492` (black).

### Kendte dårlige kildebilleder at erstatte
Tjek for bagt-ind tekst/baggrund i fremtidige crops. (Pr. juni 2026 er 60047, 193212, 193213, 193872 rettet; 192297 har stadig svag tekst.)
