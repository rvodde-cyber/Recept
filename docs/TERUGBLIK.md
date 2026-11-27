# Terugblik — spiegelfeedback per deel

Laatst bijgewerkt: **27 november 2026**.

## Uitgangspunten

- Spiegel in **vraagvorm**, geen score, geen oordeel.
- Symmetrische patroonteksten (mens / regels / resultaat).
- Leest alleen uit state; **compute en golden blijven ongewijzigd**.
- Geen extra serveropslag; reeksgeschiedenis in `localStorage` (`recept-terugblik-geschiedenis`).

## Fasevolgorde

Na de **slotfilm** (`finale`): `terugblik` → `voorspel` / pauzekaart → optioneel `hulpvraag` → `nabespreking`.

Flags (docent, localStorage):

- `recept-terugblik-actief` — fase aan (standaard aan).
- `recept-terugblik-zichtbaar` — team ziet volledig scherm (standaard aan).

**Queryparameter** (gelezen bij start in `main.tsx`, zelfde sleutels):

| Waarde | Effect |
| --- | --- |
| `?terugblik=uit` | Fase terugblik uit (`recept-terugblik-actief` = 0). |
| `?terugblik=docent` | Teamscherm kort (`recept-terugblik-zichtbaar` = 0). |
| `?terugblik=aan` | Beide weer standaard aan. |

## Regels (`src/game/terugblik/regels.ts`)

Per gekozen interventie (twee per ronde, vier per deel):

| Kant | Regel |
| --- | --- |
| **mens** | `mm > 0` (verborgen menselijke maat op interventie) |
| **regels** | `eerl > 0` (verborgen eerlijkheid) |
| **resultaat** | `prod − verz − verl > 0` (budget en betrokkenheid tellen niet) |

Meerdere kanten per kaart mogelijk; optionele `KANT_OVERRIDE` in `data/terugblik/kantOverrides.ts`.  
**A4 demo:** vaste mapping `DEMO_A4_KANTEN` op kaarten A–J.

**Deelpatroon:** tel kanten over vier keuzes. Dominant als telling ≥ 3 én minstens 2 hoger dan de tweede; anders `evenwicht`. Drempels in `config.ts` (voorlopig; kalibreren na speeltest).

**Verborgen richting:** eindstand − beginstand dit deel; marge `GELIJK_MARGE = 3` engine-punten → omhoog / omlaag / gelijk (alleen in woorden op teamscherm).

## Teksten

Patroon-, privé- en waardenkaarten: `src/game/terugblik/teksten.ts` (letterlijk volgens ontwerp 27-11-2026).  
A4-kaartkanten: `docs/TERUGBLIK-A4-KANTEN.md`.

**Verborgen richting bij oude saves:** ontbreekt `hiddenBeginDeel` → migratie zet `null`; teamscherm toont uitleg zonder richtingsregels (geen “ongeveer gelijk” als vervanger).

## Door Cursor geschreven, te beoordelen

**Glossary** (`content/glossary.nl.ts`):

- Eerlijkheid: «Werden mensen gelijk behandeld, en golden de afspraken voor iedereen?»
- Menselijke maat: «Kreeg de mens achter de maatregel ruimte om gehoord te worden?»

**Fallback uitleg terugblik** (`src/game/terugblik/teksten.ts`, zelfde zinnen als glossary):

- Eerlijkheid: «Werden mensen gelijk behandeld, en golden de afspraken voor iedereen?»
- Menselijke maat: «Kreeg de mens achter de maatregel ruimte om gehoord te worden?»

**Docent, onbekende beginstand** (`DocentTerugblikBlock.tsx`):

- «De richting van de verborgen meters is niet berekend: in deze oude save ontbreekt de beginstand van dit deel.»

**Reeksterugblik** (`ReeksTerugblikScreen.tsx`):

- «Dit is een terugblik op de delen die jullie op dit apparaat hebben afgerond.»

**Evenwicht-patroon** (`evenwichtObservatie` in `teksten.ts`): samengesteld uit tellingen ≥ 1; geen vaste «alle drie»-zin meer.

## Export (v1)

In `buildTeamExport()`:

```json
"terugblik": {
  "version": 1,
  "delen": [{ "episode", "kant", "tellingen", "verborgenRichting", "observatieIds", "waarden" }]
}
```

Oude exports zonder `terugblik` blijven importeerbaar (`normalizeTerugblikFromImport`).

## Reeksterugblik

`ReeksTerugblikScreen`: landingspagina + na A5. Verschuiving alleen bij ≥ 2 delen met verschillend patroon; waardentelling over alle zeven waarden (inclusief 0).

## Tests

`engine/__tests__/terugblik.test.ts` — classificatie, marge, symmetrie, verboden woorden, flow, export, reeks.