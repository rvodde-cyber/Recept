# Voortgang Recept

Laatst bijgewerkt: **23 november 2026** (branch `feat/recept-a1`, hulpvraagkaart onderwijs).

## Afgerond in deze sessie

- **Openingsscène (deel A+B):** nieuwe kolomindeling in `ColdPhase` — vergaderbeeld (VK1–VK5), blok Hardop, blok Onder tafel; tempo-uitleg verplaatst naar `SceneBriefing` onder **Start de scène**; bedieningsrij Sneller / Pauze / Stop.
- **Register:** `vergaderBeeld` + `vergaderBeeldAlt` in `data/episodes/content.ts`.
- **Component:** `src/components/VergaderBeeld.tsx`.
- **A4 onderstroom:** `onderstroomActief: true`; app-berichten in `data/coldOpen.ts` ongewijzigd (plaats en tekst klopten); tests op volgorde r1/r2 + typ-indicator.
- **Documentatie:** `docs/DESIGNGIDS.md` §10b, `docs/beeldbank-codes.md`, `docs/BEELDEN-CHECK.md`.
- **Tests:** `src/screens/coldPhaseLayout.test.tsx`, `engine/__tests__/coldOpenOnderstroom.test.ts`, `coldOpenFlow.test.ts`.
- **Vraagregel cold open:** `vraagregels` + `vraagregelActief`; familievraag als laatste hardop (A4 achter vlag uit).
- **Hulpvraagkaart (onderwijs):** `content/hulpvraag.nl.ts`, `HulpvraagPhase`, schakelaar docent (`onderwijsSettings`), na pauzekaart; export `hulpvraag`; beelden `public/beelden/hulpvraag/h1–h5.jpg`.

## Open voor Richard

- JPG’s **VK1–VK5** aanleveren (3:2, 1800×1200).
- Keuze welke overige UI-elementen op de scènépagina (voortgangsdots, status “Automatische weergave actief”, HelpLinks) nog gewenst zijn.