# Deploy Recept (privé)

Laatste update: **november 2026** — Cloudflare Pages

## Live URL's

| Link | URL |
| --- | --- |
| Student | `https://recept-x7k2q.pages.dev/` |
| Docent | `https://recept-x7k2q.pages.dev/?docent=1` |

Projectnaam in Cloudflare Pages: `recept-x7k2q`.

### Vervallen adres (Netlify)

| Oud | Status |
| --- | --- |
| https://recept-k8m3n7p2.netlify.app/ | **Vervallen** — niet meer deployen of delen |

## Cloudflare Pages (via GitHub)

1. In Cloudflare: **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Selecteer de GitHub-repo en de branch voor productie (bijv. `main`).
3. Build-instellingen:

| Instelling | Waarde |
| --- | --- |
| Framework preset | Geen / Vite (of None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leeg)* |

4. Onder **Environment variables** (Production):

| Naam | Waarde |
| --- | --- |
| `NODE_VERSION` | `20` |

5. Save and Deploy. Volgende pushes naar de gekoppelde branch bouwen automatisch.

## Toegang testers (Cloudflare Access)

De testsite staat achter **Cloudflare Access** met **One-time PIN** (e-mailcode):

- Bezoeker voert een toegestaan e-mailadres in en ontvangt een eenmalige pincode per mail.
- Alleen adressen die in het Access-beleid staan (of via een groep) werken.
- Geen accounts in de app zelf; geen analytics.

Access instellen in **Zero Trust** → **Access** → **Applications**: self-hosted applicatie op het `*.pages.dev`-hostname (of custom domain later), policy **Allow** met **One-time PIN** voor de gewenste e-maildomeinen of individuele adressen.

## Lokaal vóór push

```bash
npm ci
npm test
npm run build
```

Deploy loopt via Git-integratie; er is geen aparte Netlify/CLI-productiestap meer.

## QR-code (student)

Het live adres staat vast. Genereer de student-QR met `QR_BASE_URL=https://recept-x7k2q.pages.dev npm run qr` (zie `scripts/generate-qr-student.ts`).

## Beveiliging headers

Cloudflare Pages leest `public/_headers` mee in de build (`dist/_headers`). Zie die file voor security-headers op alle paden.

## Zoekmachines

`index.html` bevat `noindex,nofollow`; `public/robots.txt` weert alle crawlers. De testsite hoort niet geïndexeerd te worden.