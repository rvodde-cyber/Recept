# Beelden — controlelijst I1–I5, Piotr, Erik, Yasmin

Bron van waarheid voor akkoord: `data/beeldenCheck.ts` (`akkoordRichard`). De app toont **alleen** beelden met akkoord = ja; anders neutraal silhouet.

Stereotypencheck-kolommen volgen **docs/VOORSTELLEN-RECEPT-29-10-2026.md §6** (ja / nee / twijfel + toelichting).

Legenda kolommen: **1** eigen verhaal · **2** geen herkomstclichés · **3** geen dreigingsframe · **4** gelijkwaardige uitbeelding · **5** functie boven afkomst · **6** geen karikatuur · **7** alt-tekst OK · **8** generatie-controle (Bianchi et al., 2023) · **9** akkoord Richard

## Sfeerbeelden I1–I5

| Code | Omschrijving | Alt-tekst (NL) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 akkoord |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I1 | Intro aflevering 1 — woonhuis + schuur Berkel-Enschot | `public/beelden/I1.jpg` (staand 3:4) | twijfel | ja | ja | n.v.t. | ja | ja | ja | n.v.t. | **nee** |
| I2 | Intro aflevering 2 — fabriekshal 1996 | `public/beelden/I2.jpg` (staand 3:4) — **geplaatst in repo** | twijfel | ja | ja | n.v.t. | ja | ja | ja | n.v.t. | **nee** |
| I3 | Intro + cold/slot A3 — directie/vestigingen 2009 (restaurant/slot: hergebruik I3 of apart beeld) | `public/beelden/I3.jpg` (staand 3:4) — **geplaatst in repo** | twijfel | ja | ja | n.v.t. | ja | ja | ja | n.v.t. | **nee** |
| I4 | Intro aflevering 4 — TEMPO (T4 demo) | Leeg kantoor met actieve schermen bij zonsopgang | n.v.t. | ja | ja | n.v.t. | n.v.t. | ja | ja | n.v.t. | **nee** |
| I5 | Intro aflevering 5 — Spoorzone / conglomeraat 2036 | `public/beelden/I5.jpg` (staand 3:4) — **geplaatst in repo** | twijfel | ja | ja | n.v.t. | ja | ja | ja | n.v.t. | **nee** |

Toelichting I1: beeld nog niet aangeleverd; check op clichés volgt bij definitief bestand. **I2, I3, I5:** bestanden staan onder `public/beelden/`; inhoudelijke akkoord-check (stereotypen, WCAG) nog open (`akkoordRichard`).

## Intro split — object-position (6 nov 2026)

Voor `introBeeldRechts` zet het register **`introBeeldFocus`** (`{ x, y }` in procenten) op **`figure.intro-beeld`** als CSS-variabelen; `object-fit: cover` gebruikt `object-position: var(--intro-focus-x) var(--intro-focus-y)`. Afstemmen op echt beeld (I1–I3, I5) zodra assets definitief zijn. **Controle 390×844** gebruikt als referentie in devtools.

| Aflevering | introBeeldFocus (x, y) | Toelichting |
| --- | --- | --- |
| A1 | **55%, 62%** | Huis + schuur in beeld i.p.v. alleen dak (smalle strook op smal scherm) |
| A2 | **50%, 60%** | Fabriek/band in beeld |
| A3 | **50%, 50%** | Tafel/scène gecentreerd — verfijnen bij definitief I3 |
| A4 | — | Geen intro split / geen veld |
| A5 | **50%, 50%** | Glazen ingang — verfijnen bij definitief I5 |

## Vergadertafel openingsscène (nov 2026)

| Code | Gebruik in UI | Bestand | Alt (register) | Status |
| --- | --- | --- | --- | --- |
| VK1 | A1 ronde 1 | `public/beelden/VK1.webp` (112 kB) | `vergaderBeeldAlt` ep1 | **geplaatst, akkoord Richard volgt** |
| VK1-2 | A1 ronde 2 | `public/beelden/VK1-2.webp` (155 kB) | `vergaderBeeld.altRonde2` ep1 | **geplaatst, akkoord Richard volgt** |
| VK2-1 | A2 ronde 1 | `public/beelden/VK2-1.webp` (141 kB) | `vergaderBeeld.altRonde1` ep2 | **geplaatst, akkoord Richard volgt** |
| VK2 | A2 ronde 2 | `public/beelden/VK2.webp` (107 kB) | `vergaderBeeldAlt` ep2 | **geplaatst, akkoord Richard volgt** |
| VK3 | A3 ronde 1 en 2 | `public/beelden/VK3.webp` (84 kB) | `vergaderBeeldAlt` ep3 | **geplaatst, akkoord Richard volgt** |
| VK4-1 | A4 ronde 1 | `public/beelden/VK4-1.webp` (160 kB) | `vergaderBeeld.altRonde1` ep4 | **geplaatst, akkoord Richard volgt** |
| VK4-2 | A4 ronde 2 | `public/beelden/VK4-2.webp` (152 kB) | `vergaderBeeld.altRonde2` ep4 | **geplaatst, akkoord Richard volgt** |
| VK5-1 | A5 ronde 1 | `public/beelden/VK5-1.webp` (44 kB) | `vergaderBeeld.altRonde1` ep5 | **geplaatst, akkoord Richard volgt** |
| VK5 | A5 ronde 2 | `public/beelden/VK5.webp` (52 kB) | `vergaderBeeldAlt` ep5 | **geplaatst, akkoord Richard volgt** |
| VK4 | archief | `public/beelden/VK4.webp` (96 kB) | niet in UI | archief |

Bron-JPG: `beelden-bron/vergaderbeelden/`. Register: `VERGADER_BEELD_EXT` + `vergaderBeeldUrl()` (.webp, jpg fallback via register). Omzetting: `node scripts/verklein-beelden.mjs vergader`.

## UI — nog te leveren of te verbeteren (6 nov 2026)

| Onderdeel | Aflevering | Status |
| --- | --- | --- |
| Prikbord / briefje (dilemma Wim) | A2 | Placeholder of geen fotorealistisch asset — `BriefjePanel` is tekst |
| Telefoon met sms (2009) | A3 | Styling in `SmsDilemmaPanel`; optioneel referentiebeeld |
| Lens / privébericht (neutraal) | A5 | Styling in `LensDilemmaPanel` + `Onderstroom` lens |
| Restaurant 2009 | A3 | In slot/cold hergebruik I3 of apart beeld — nog niet akkoord |
| Schuur 2036 met kist (slot A5) | A5 | Cues in `buildSlotEp5`; beeld hergebruik **I5** of apart — inhoud akkoord open |

## Aflevering 1 — cold open, briefje, slot (3 nov 2026)

| Code | Omschrijving | Status app | Akkoord |
| --- | --- | --- | --- |
| C1 | Keukentafel 1984 (cold open r1) | Placeholder/silhouet via `SceneBackground` | **nee** |
| W1 | Met de hand 1984 (cold open r2) | Placeholder/silhouet | **nee** |
| T1 | Schuur 1984 (slot) | Placeholder/silhouet | **nee** |
| A1-BRIEFJE | Briefje tussen kasboekpagina's (UI: tekst in `BriefjePanel`, geen apart beeld) | Geen asset vereist voor speelbare tekst | **nee** |
| A1-SCHRIFT | Twee handschriften op één pagina (slot beat 6) | Placeholder/silhouet | **nee** |

## Portretten (legacy sectie)

Zie tabel **Portretten — aanwezigheid** hierboven. UI laadt portretten **alleen** in Wie is wie (`GlossaryModal`), niet in berichten of nabespreking.

## UI A3 — telefoon met sms (2009)

| Onderdeel | Status app | Akkoord |
| --- | --- | --- |
| Sms-dilemma / feature phone — generieke chrome, geen merk-UI (`SmsDilemmaPanel`, CSS `sms-dilemma-panel`) | Stijl + copy aanwezig; geen apart fotobestand | **nee** |
| Optioneel: referentiebeeld 2009-toetsenbordtelefoon in achtergrond | Nog te maken indien gewenst | **nee** |

## Tijdgeest — Renault 5 en rekwisieten (5 nov 2026)

Bron prompts: **`docs/TIJDGEEST.md`**. Bestanden: `public/beelden/<code>.webp`. Rekwisieten in de UI pas wanneer beeld akkoord is of past bij bestaande achtergrond; tot die tijd alleen documentatie.

| Code | Omschrijving | Status app | Akkoord |
| --- | --- | --- | --- |
| RENAULT-84 | Rode Renault 5 bij schuur, kratten achterbank | Nog geen asset | **nee** |
| RENAULT-96 | Zelfde auto, roestig, industrieterrein | Nog geen asset | **nee** |
| RENAULT-09 | Klassieker op parkeerterrein fabriek | Nog geen asset | **nee** |
| RENAULT-26 | Elektrische retro-hatchback bij dronefabriek | Nog geen asset | **nee** |
| RENAULT-36 | Oude rode 5 in glazen vitrine lobby | Nog geen asset | **nee** |
| REKW-84-CASSETTE | Cassetterecorder met handgeschreven label | Nog geen asset | **nee** |
| REKW-84-TELEFOON | Telefoon met draaischijf | Nog geen asset | **nee** |
| REKW-96-PC | Beige jaren-90 pc + semafoon (apart REKW-96-SEMAFOON) | Nog geen asset | **nee** |
| REKW-96-SEMAFOON | Semafoon op bureau | Nog geen asset | **nee** |
| REKW-09-BLACKBERRY | BlackBerry | Nog geen asset | **nee** |
| REKW-09-HYVES | Pc met sociaal netwerk open (generiek, geen logo) | Nog geen asset | **nee** |
| REKW-09-WII | Spelconsole pauzeruimte | Nog geen asset | **nee** |
| REKW-26-PADEL | Padelbaan naast fabriek | Nog geen asset | **nee** |
| REKW-26-SMARTWATCH | Smartwatch (detail) | Nog geen asset | **nee** |
| REKW-36-BEZORG | Zelfrijdende bezorgwagen laaddock | Nog geen asset | **nee** |

## Afleveringstrailer vóór intro (10 nov 2026)

Bron: `data/trailers.ts` → `public/beelden/<CODE>.jpg` (3:2, 1800×1200). Originelen: `beelden-bron/trailers/` (niet in git). Normalisatie: `scripts/normalize-trailer-beelden.mjs` (sharp-cli).

| Code | kB (na) | Status | Opmerking |
| --- | --- | --- | --- |
| I1 | (bestaand) | controleren | Ongewijzigd |
| I2 | (bestaand) | controleren | Ongewijzigd |
| T1 | 327 | controleren | >250 kB; optioneel extra compressie |
| W1 | 250 | controleren | — |
| C1 | 186 | controleren | — |
| L1 | 202 | controleren | Ook shot A5 |
| T4 | (bestaand) | controleren | — |
| L4 | 238 | controleren | Afgeleid van **D1** (D1 blijft staan) |
| TR2-2 | 189 | controleren | — |
| TR2-3 | 386 | controleren | >250 kB |
| TR2-4 | 206 | controleren | — |
| TR2-5 | 209 | controleren | — |
| TR3-1 | 249 | controleren | — |
| TR3-2 | 178 | controleren | — |
| TR3-3 | 199 | controleren | — |
| TR3-4 | 154 | controleren | — |
| TR3-5 | 173 | controleren | — |
| TR4-2 | 326 | controleren | >250 kB |
| TR4-4 | 217 | controleren | — |
| TR4-5 | 214 | controleren | — |
| TR5-1 | 283 | controleren | >250 kB |
| TR5-2 | 193 | controleren | — |
| TR5-3 | 182 | controleren | — |
| TR5-4 | 282 | controleren | >250 kB |

Richard: inhoud akkoord Firefly nog open. **T1, TR2-3, TR4-2, TR5-1, TR5-4** boven 250 kB na resize.

## Portretten — aanwezigheid (10 nov 2026)

| Item | Status |
| --- | --- |
| Lijst P1 (28 codes) | **28/28** JPG in `public/beelden/portretten/` |
| `data/personen.ts` | Elke `portret`-code heeft bestand |
| Extra | **P-SANNE-2026.jpg** (niet op lijst; geen Wie-is-wie-tegel) |
| Naam | `P-ANNEFLEUR-2036` → hernoemd naar **`P-ANNE-FLEUR-2036.jpg`** (register) |
| Originelen | `public/.../_origineel` → **`beelden-bron/portretten-origineel/`** (gitignore) |
| Akkoord Richard | nog **nee** per bestand |

## Hulpvraag — h1–h5 (nov 2026)

| Code | Bestand | kB (webp) | Bron |
| --- | --- | --- | --- |
| h1 | `public/beelden/hulpvraag/h1.webp` | 60 | `beelden-bron/hulpvraag/h1.jpg` |
| h2 | `public/beelden/hulpvraag/h2.webp` | 100 | `beelden-bron/hulpvraag/h2.jpg` |
| h3 | `public/beelden/hulpvraag/h3.webp` | 142 | `beelden-bron/hulpvraag/h3.jpg` |
| h4 | `public/beelden/hulpvraag/h4.webp` | 129 | `beelden-bron/hulpvraag/h4.jpg` |
| h5 | `public/beelden/hulpvraag/h5.webp` | 88 | `beelden-bron/hulpvraag/h5.jpg` |

Register: `HULPVRAAG_BEELD_EXT` + `hulpvraagBeeldUrl()`. Omzetting: `node scripts/verklein-beelden.mjs hulpvraag`.

## Gesprekskaart — GK1–GK5 (dual coding, nov 2026)

| Code | Aflevering | Bestand | Afmeting | kB | Status |
| --- | --- | --- | --- | --- | --- |
| GK1 | A1 Het klusje voor Harrie | `public/beelden/gesprekskaart/gk1.webp` | 16:9 UI; bron 2688×1536 (7:4) | 47 | geplaatst, akkoord Richard volgt |
| GK2 | A2 Het gat in het loongebouw | `public/beelden/gesprekskaart/gk2.webp` | idem | 95 | geplaatst, akkoord Richard volgt |
| GK3 | A3 Topresultaten | `public/beelden/gesprekskaart/gk3.webp` | idem | 105 | geplaatst, akkoord Richard volgt |
| GK4 | A4 Het voorstel van IT | `public/beelden/gesprekskaart/gk4.webp` | idem | 48 | geplaatst, akkoord Richard volgt |
| GK5 | A5 De kantlijn | `public/beelden/gesprekskaart/gk5.webp` | idem | 78 | geplaatst, akkoord Richard volgt |

Bron: `beelden-bron/gesprekskaart/gk*.jpg` (liggend). Omzetting: `node scripts/verklein-beelden.mjs gesprekskaart` — resize **inside** 1600×900, q80. Register: `GESPREKSKAART_BEELD_EXT` → webp. UI: CSS 16:9, `object-position` 50% 45%.

## WCAG

Alt-teksten zijn Nederlands en beschrijvend, zonder herkomstlabels (WCAG 2.2, zie voorstel §9).
