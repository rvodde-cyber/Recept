# Open vragen Recept

| # | Onderwerp | Vraag | Status |
| --- | --- | --- | --- |
| 1 | VK-beelden | Richard levert VK1–VK5 JPG’s aan volgens prompts (3:2, 1800×1200). | **te maken door Richard** |
| 2 | Scène-UI opruimen | Voortgangsdots, hint “Automatische weergave actief” en `HelpLinks` op de actieve openingsscène — behouden of schrappen? | wacht op Richard |
| 3 | Ronde-specifieke VK | Standaard zelfde code r1/r2; later per ronde andere code indien gewenst. | register klaar |
| 4 | Docs onderstroom A4 | `docs/ONDERSTROOM.md` en `DESIGNGIDS.md` vermelden nog «A4 uit»; inhoudelijk verouderd na `onderstroomActief: true`. | opschonen wanneer Richard wil |
| 5 | Hulpvraag-beelden | h1–h3 volgens opdracht; h4/h5 staan als JPG in repo; eventueel .webp aanleveren (webp wint in register). | inhoudRichard |
| 8 | Gesprekskaart-beelden GK1–GK5 | JPG in repo (>200 kB elk); inhoudelijk akkoord en optioneel .webp/compressie. | geplaatst, akkoord Richard volgt |
| 6 | Recept/docs | Geen aparte map `Recept/docs/`; alles in `docs/`. | — |
| 7 | Vraagregel A4 | Teksten in register; standaard `vraagregelActief: false` (demo-golden). | Richard beslist wanneer aan |
| 9 | Scroll per scherm | Landingspagina → fasewissel: bovenaan (`ViewReset`, nov 2026). | **opgelost in build** |

## Orakeltoon, te beoordelen door Richard

Na pass op gesprekskaart A3, A4 r2-hint en spelersteksten (nov 2026). **Niet wijzigen in code** tot Richard beslist; glossaryterm „Symptoom en oorzaak” blijft (gewone taal).

| Bron | Tekstfragment / patroon | Notitie |
| --- | --- | --- |
| `content/intros.nl.ts` | Hint A1–A5: herhaald „Bedenk eens …” / „Let op wat …” | Spelershints; geen spreuk, wel sturend — bewust zo? |
| `content/hulpvraag.nl.ts` (h2) | Sanne: „Zo'n gesprek met een formulier **voelt als controle** …” | Personagedialoog; orakelpatroon in mond van NPC |
| `data/sanne.ts` | Groepsapp: „**Niet via een systeem, maar** met hem.” | „niet X, maar Y” in bericht aan spelers |
| `data/sanne.ts` | „Dat kan, **maar** dan wil ik het wel hardop horen” | milder; geen klassieke wijsheid |
| `data/piotr-lijn.ts` | Onderstroom: „niet kent bij naam, **maar** wel kent van gezicht” | narratief, geen hint naar speler |
| `data/piotr-lijn.ts` | Zelfde blok; geen „voelt als … totdat” meer in actieve spelersteksten | Oud demo: „Groei voelt als succes, totdat …” → vervangen door A4 `hintRonde2` |
| `docs/claude-outputs/recept-gesprekskaarten-voorstel-05-11-2026.md` | „**Wat zijn topresultaten waard** als ze worden betaald met …” | **niet** in `data/gesprekskaarten.ts` (verwijderd) |
| `content/glossary.nl.ts` | Term „Symptoom en oorzaak” | **ongewijzigd** — Richard: gewone taal |