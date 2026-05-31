# Catalogue — Claude arbejdsregler

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
Sitet `https://matiasbjerre-hub.github.io/catalogue/` serverer fra rod-`index.html` på `main`, som loader kildefilerne fra `project/` direkte. Hard refresh (Ctrl/Cmd+Shift+R) rydder browser-cache.
