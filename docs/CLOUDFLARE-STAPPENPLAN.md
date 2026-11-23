# Recept online zetten voor testers: stappenplan Cloudflare Pages en Cloudflare Access

Opgesteld op 20 november 2026 voor Richard (Lectoraat Ethisch Werken, Fontys).

## 1. Stand van zaken

- De repo `rvodde-cyber/Recept` staat op GitHub. Branch `main` staat op commit 7694aef, dus de push is gelukt.
- Recept is een statische Vite/React-app. Er is geen server, geen database en er zijn geen geheime sleutels of omgevingsvariabelen nodig. Voortgang van spelers wordt lokaal in de browser bewaard.
- De app heeft al `noindex,nofollow` in `index.html` en een `robots.txt` die zoekmachines weert.
- `vite.config.ts` gebruikt het standaardpad `/`, dat past bij een eigen `*.pages.dev`-adres.
- Er draait nog een oude testsite op Netlify (zie `docs/DEPLOY.md`). Waarschijnlijk wijst ook de QR-code (`docs/qr`, `docs/qr-student.png`) daarheen; Cursor controleert dat.

## 2. Wie doet wat

| Taak | Richard | Claude | Cursor |
|---|---|---|---|
| Cloudflare-account en inloggen | ja | nee | nee |
| GitHub aan Cloudflare koppelen (toestemming geven) | ja | nee | nee |
| Pages-project aanmaken en instellingen invullen | ja, of samen met Claude in de browser | kan meekijken en invullen in Chrome, na jouw akkoord per stap | nee |
| Cloudflare Access instellen (e-mailcode) | ja, of samen met Claude in de browser | idem | nee |
| Netlify-verwijzingen opruimen, README en DEPLOY.md bijwerken | beoordelen | nee | ja |
| QR-code opnieuw genereren met het nieuwe adres | beoordelen | nee | ja (`npm run qr`) |
| Controleren of `npm run build` schoon draait | nee | kan lokaal draaien | ja |
| Licentie kiezen en `LICENSE` plaatsen | kiezen | kan het bestand maken | kan het bestand maken |
| Oude repo op privé zetten | ja (GitHub, Settings) | nee | nee |
| Oude Netlify-site uitzetten na de overstap | ja | nee | nee |

Aanmaken van accounts, toestemming geven aan apps en wijzigen van accountinstellingen doe jij zelf of bevestig je per stap. Wachtwoorden en e-mailcodes typ jij.

## 3. Stappen

### A. Voorbereiding (Cursor, ongeveer 10 minuten)

1. Open `C:\Users\876409\projects\recept` in Cursor.
2. Laat Cursor de prompt uit hoofdstuk 4 uitvoeren.
3. Controleer: `npm test` en `npm run build` slagen zonder fouten.
4. Commit en push naar GitHub (`git push`).

### B. Pages-project aanmaken (Richard, ongeveer 10 minuten)

1. Log in op het Cloudflare-dashboard.
2. Kies **Workers & Pages**, dan **Create application**, dan **Pages**, dan **Import an existing Git repository**.
3. Koppel je GitHub-account en geef toegang tot de repo `Recept`. Dit kan ook met een privé-repo.
4. Vul in:
   - Productiebranch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leeg laten
   - Omgevingsvariabele (voor de zekerheid): `NODE_VERSION` = `20`
5. Kies **Save and Deploy**. Na een paar minuten staat de site op `https://<projectnaam>.pages.dev`.
6. Kies bewust een niet-raadbare projectnaam, bijvoorbeeld `recept-<paar-willekeurige-tekens>`.

Let op: wie via Git deployt, kan later niet meer overstappen naar handmatig uploaden. Dat is geen bezwaar, want de map `dist-cloudflare` is dan niet meer nodig.

### C. Toegang beperken met Cloudflare Access (Richard, ongeveer 15 minuten)

1. Ga in het dashboard naar **Zero Trust** en kies, als erom gevraagd wordt, het gratis plan (tot 50 gebruikers).
2. Controleer onder **Settings, Authentication, Login methods** dat **One-time PIN** aanstaat.
3. Ga naar **Access, Applications, Add an application** en kies **Self-hosted**.
4. Vul de domeinnaam in van je Pages-project, bijvoorbeeld `recept-xxxx.pages.dev`. Zet ook de voorbeeldadressen met hash (`*.recept-xxxx.pages.dev`) onder dezelfde bescherming, anders blijven die publiek bereikbaar.
5. Maak een **Allow**-beleid:
   - Naam: "Testers Recept"
   - Include: **Emails** met de adressen van je testers, of **Emails ending in** `@fontys.nl` voor alle collega's
6. Sla op. Open de site in een privévenster. Je ziet nu een inlogscherm, vult je e-mailadres in en krijgt een code per mail.
7. Let op: alleen adressen die in het beleid staan, ontvangen een code. Check bij testers eerst hun spammap.

### D. Testen en uitnodigen

1. Test zelf met een privévenster en met een adres dat niet op de lijst staat. Dat laatste moet geweigerd worden.
2. Stuur testers de link, een korte uitleg en een manier om feedback te geven.
3. Genereer de QR-code opnieuw met het nieuwe adres (Cursor, `npm run qr`), zodat de oude Netlify-QR niet meer verspreid wordt.

### E. Opruimen

1. Zet de oude Netlify-site uit of verwijder hem, zodra Cloudflare werkt.
2. Zet de oude repo `rvodde-cyber-community-moreel-vakmanschap` op privé (GitHub, Settings, onderaan **Change visibility**).
3. Haal het Bitwarden-installatiebestand uit die oude repo (`git rm`, commit, push). Zet de repo eerst op privé als je haast hebt.
4. Beslis of `Recept` privé blijft tot de licentie is gekozen.

## 4. Prompt voor Cursor

Plak dit in Cursor, geopend in de map `recept`:

```
Context: dit is de zelfstandige repo "Recept" (Vite, React, TypeScript, HR-businessgame). Hij gaat naar Cloudflare Pages via Git-integratie (build: npm run build, output: dist) en komt achter Cloudflare Access met e-mailcode. We stappen af van Netlify. Wijzig geen spelinhoud, engine, data of beelden.

Doe, in deze volgorde:
1. Zoek alle verwijzingen naar Netlify (netlify, .netlify, netlify.app, netlify-cli) in README.md, docs/DEPLOY.md, scripts/ en package.json. Vervang ze door Cloudflare Pages. Herschrijf docs/DEPLOY.md: Cloudflare Pages via GitHub, instellingen (build command npm run build, output dist, root leeg, NODE_VERSION 20), Cloudflare Access met One-time PIN voor testers, en het oude adres als "vervallen". Laat de nieuwe projectnaam als placeholder <PROJECTNAAM>.pages.dev staan.
2. Zet in README.md een kort kopje "Testen" dat uitlegt dat de testversie achter een e-mailcode staat en hoe je toegang aanvraagt bij Richard.
3. Voeg public/_headers toe met voor alle paden: X-Content-Type-Options: nosniff, Referrer-Policy: no-referrer, X-Frame-Options: DENY, Permissions-Policy: camera=(), microphone=(), geolocation=().
4. Controleer dat index.html noindex,nofollow behoudt en dat public/robots.txt alles weert.
5. Controleer dat vite.config.ts geen base-pad nodig heeft (site draait op de root van een pages.dev-adres) en dat er geen hardgecodeerde Netlify-URL's of absolute localhost-URL's in src/ staan.
6. Voer uit: npm ci, npm test, npm run build. Los fouten op die door jouw wijzigingen komen. Meld andere fouten, repareer ze niet stilletjes.
7. Laat scripts/generate-qr-student.ts de QR-URL uit een omgevingsvariabele QR_BASE_URL lezen (valt terug op https://<PROJECTNAAM>.pages.dev), zodat ik de QR kan maken zodra het adres bekend is. Maak de QR nog niet opnieuw.
8. Maak een commit per stap met duidelijke Nederlandse commitberichten. Push niet; laat de pushstap aan mij.

Geef aan het eind een korte lijst van wat je hebt gewijzigd en wat ik nog zelf moet doen.
```

## 5. Ethische en praktische controles bij testers

- **Informatie vooraf:** laat testers weten wat Recept bewaart (alleen lokaal in hun browser) en dat er geen persoonsgegevens naar een server gaan.
- **Vrijwilligheid:** testers mogen zonder gevolgen stoppen of feedback weigeren.
- **Beperkte kring:** met Access bepaal je zelf wie meespeelt. Haal adressen weg na afloop van de test.
- **Feedback:** spreek af waar feedback binnenkomt en wie die leest, bijvoorbeeld een mailadres of formulier.
- **Eigenaarschap en licentie:** Recept is gemaakt met AI-gegenereerde beelden en teksten. Leg vast dat jij de makerschap en keuzes verantwoordt, en check bij Fontys (IP-beleid) wie rechthebbende is voordat je publiek deelt of licenseert.

## 6. Bronnen

Cloudflare. (z.d.-a). *Cloudflare Access*. https://www.cloudflare.com/products/cloudflare-access/

Cloudflare. (z.d.-b). *Configure your deployment*. Cloudflare Docs. https://developers.cloudflare.com/learning-paths/personal-website/pages-setup/git-configure-deployment

Cloudflare. (z.d.-c). *Deploy a Vite 3 project*. Cloudflare Pages docs. https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/

Cloudflare. (z.d.-d). *Git integration*. Cloudflare Pages docs. https://developers.cloudflare.com/pages/get-started/guide/
