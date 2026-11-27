# Terugblik — A4-kaartkanten (demo)

Mapping: `data/terugblik/kantOverrides.ts` → `DEMO_A4_KANTEN`.  
Zichtbare motor: `engine/compute.ts` / `data/rounds.ts` (driver-`e`).  
Verborgen na ronde (mm-hooks): `src/game/hiddenMeters.ts` — alleen voor sommige kaarten; **geen** terugblik-kant daaruit.

Spelregel A4: kaarten **A–E** in ronde 1, **F–J** in ronde 2; per ronde precies **twee verschillende** kaarten → vier keuzes per deel.

## Documentatieregel “regels” op A4

Een kaart krijgt kant **regels** als in `card.e` **bureaucratie ≥ 10** of **controle ≥ 10** (stijging t.o.v. driver). In de vaste mapping sluit dat aan op:

- **B** — controle +10 → regels (+ resultaat via capaciteit/controle)
- **J** — bureaucratie +12 → regels

Kaarten zonder die drempel krijgen in de mapping geen **regels**, ook niet als `verborgen.eerlijkheid` elders speelt (A4 gebruikt geen interventietabel).

## Mapping (vast)

| ID | Ronde | Naam | Mens | Regels | Resultaat | mm-hook hidden |
| --- | --- | --- | --- | --- | --- | --- |
| A | 1 | Vitaliteitsweek | nee | nee | nee | — |
| B | 1 | Aanwezigheidsbonus | nee | ja | ja | mm −8 |
| C | 1 | Flexkrachten | nee | nee | ja | mm −5 |
| D | 1 | TEMPO-norm begrenzen | ja | nee | nee | mm +8 |
| E | 1 | Coaching en extra ploegleider | ja | nee | nee | mm +6 |
| F | 2 | Gewetensclausule | ja | nee | nee | mm +8 |
| G | 2 | Defensie via TEMPO | nee | nee | ja | mm −6 |
| H | 2 | Regels schrappen | ja | nee | nee | mm +6 |
| I | 2 | Ploegleiders opleiden | ja | nee | nee | mm +4 |
| J | 2 | Compliance-afdeling | nee | ja | nee | mm −4 |

Lege mapping (**A: []**) levert geen kant-telling; geen crash in `kantenVoorKaart`.

## Dominant patroon **regels** in A4

In A4 is het patroon **regels voorop onbereikbaar**: **B** zit in ronde 1 en **J** in ronde 2, en elke kaart kan maar één keer gekozen worden. Maximaal twee keer regels; de drempel is drie.

## Patronen in A4 (voor docenten)

In A4 verschijnen in de terugblik alleen de deelpatronen **mens**, **resultaat** en **evenwicht** — nooit **regels** als dominante kant.

## Dominant patroon **mens**

Vier menskaarten **D, E, F, H** in één deel → telling mens = 4 → patroon **mens** (mits geen andere mix).