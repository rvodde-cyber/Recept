# Voortgang Recept

Laatst bijgewerkt: **27 november 2026** (branch `feat/recept-a1`, restpunten opmerkingenbundel).

## Afgerond in deze sessie

- **Stap 1:** gesprekskaart A3 en A4 r2 `hintRonde2` gecontroleerd — al conform spec (`data/gesprekskaarten.ts`, `content/intros.nl.ts`).
- **Stap 2:** Marco 30/47/57 in `data/personen.ts`; serieconcept + `docs/PORTRETTEN-LIJST.md`; Harrie 54 in 2009 al overal (geen code-66). Test `engine/__tests__/personenLeeftijd.test.ts`.
- **Stap 3:** spelersteksten op rolverdeling gecontroleerd — geen wijzigingen nodig.
- **Stap 4:** lijst orakeltoon aangevuld in `docs/OPEN-VRAGEN.md` (§ Orakeltoon).
- **Cold open A5:** dubbele lensberichten voorkomen via dedupe in `buildColdTimeline` + render-stack; test `engine/__tests__/coldOpenDuplicates.test.ts`; data A5 r1 heeft elk bericht één keer.
- **Controle (geen codewijziging):** A1 alinea 2 + gk1-alt conform spec in `data/gesprekskaarten.ts`; scroll bovenaan via centrale `ViewReset` / `viewKey` in `App.tsx`, test `src/lib/scrollToTop.test.tsx` (`scrollTo` top 0). Tests + build groen.
- **Controle eerdere pass:** beeld-CSS zonder max-height; zie regels hieronder.
- **Beeldweergave:** gesprekskaart (16:9) en vergader/VK (3:2) zonder `max-height`; breedte via `min(100%, vh)`; hulpvraag `object-position: 50% 25%`; tests `engine/__tests__/faseBeeldCss.test.ts`; `DESIGNGIDS` § beelden.
- **Scroll-reset:** `ViewReset` + `scrollToTop` / `focusScreenHeading`; viewKey op aflevering, ronde, fase, home en uitleg; openingsscène-autoscroll ongewijzigd (`DESIGNGIDS` § scroll).
- **Gesprekskaartbeelden liggend** (eerdere sessie); **A1-tekst** (eerdere sessie).

## Afgerond (eerder)

- **Webp-batch:** `scripts/verklein-beelden.mjs` uitgebreid (`hulpvraag`, `vergader`, `gesprekskaart`); bron in `beelden-bron/hulpvraag/` en `beelden-bron/vergaderbeelden/`.
- **Registers:** `HULPVRAAG_BEELD_EXT` → webp; nieuw `VERGADER_BEELD_EXT` + `vergaderBeeldUrl()`; `VergaderBeeld` geen harde `.jpg` meer.
- **Kopieën:** `hulpvraag - kopie/`, `h4/h5 - kopie.jpg` verwijderd (identiek, geen verwijzingen).
- **public/beelden:** ~30 MB → ~13 MB; portretten/trailers alleen gemeten, niet gewijzigd.

## Afgerond (eerder)

- **Gesprekskaart-beeld:** velden `beeld` + `alt`; `GesprekskaartBeeld`; tests scherm + engine.
- **Documentatie:** `docs/beeldbank-codes.md` (GK1–GK5), `docs/BEELDEN-CHECK.md`, `docs/DESIGNGIDS.md`.

## Afgerond (eerder)

- **Openingsscène (deel A+B):** nieuwe kolomindeling in `ColdPhase` — vergaderbeeld (VK1–VK5), blok Hardop, blok Onder tafel; tempo-uitleg verplaatst naar `SceneBriefing` onder **Start de scène**; bedieningsrij Sneller / Pauze / Stop.
- **Register:** `vergaderBeeld` + `vergaderBeeldAlt` in `data/episodes/content.ts`.
- **Component:** `src/components/VergaderBeeld.tsx`.
- **A4 onderstroom:** `onderstroomActief: true`; app-berichten in `data/coldOpen.ts` ongewijzigd (plaats en tekst klopten); tests op volgorde r1/r2 + typ-indicator.
- **Documentatie:** `docs/DESIGNGIDS.md` §10b, `docs/beeldbank-codes.md`, `docs/BEELDEN-CHECK.md`.
- **Tests:** `src/screens/coldPhaseLayout.test.tsx`, `engine/__tests__/coldOpenOnderstroom.test.ts`, `coldOpenFlow.test.ts`.
- **Vraagregel cold open:** `vraagregels` + `vraagregelActief`; familievraag als laatste hardop (A4 achter vlag uit).
- **Hulpvraagkaart (onderwijs):** `content/hulpvraag.nl.ts`, `HulpvraagPhase`, schakelaar docent (`onderwijsSettings`), na pauzekaart; export `hulpvraag`; beelden `public/beelden/hulpvraag/h1–h5.webp`.

## Open voor Richard

- JPG’s **VK1–VK5** aanleveren (3:2, 1800×1200).
- Keuze welke overige UI-elementen op de scènépagina (voortgangsdots, status “Automatische weergave actief”, HelpLinks) nog gewenst zijn.