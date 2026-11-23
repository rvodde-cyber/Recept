import type { ColdOpenDef } from './content';
import type { ColdTimelineStep, OnderstroomInsert, VraagregelBlock } from './coldOpenModel';

function insertsAfterIndex(inserts: readonly OnderstroomInsert[] | undefined, idx: number) {
  if (!inserts?.length) return [];
  return inserts.filter((i) => i.afterIndex === idx);
}

function vraagAfterIndex(blocks: readonly VraagregelBlock[] | undefined, idx: number) {
  if (!blocks?.length) return [];
  return blocks.filter((b) => b.afterIndex === idx);
}

/** Volledige afspeellijst: titel/hardop plus optionele onderstroom en vraagregels. */
export function buildColdTimeline(
  def: ColdOpenDef,
  onderstroomActief: boolean,
  vraagregelActief = false,
): readonly ColdTimelineStep[] {
  const steps: ColdTimelineStep[] = [];
  const inserts = onderstroomActief ? def.onderstroom : undefined;
  const vragen = vraagregelActief ? def.vraagregels : undefined;

  def.lines.forEach(([speaker, text], idx) => {
    steps.push({ kind: 'speech', speaker, text });
    for (const ins of insertsAfterIndex(inserts, idx)) {
      if (ins.typIndicator) {
        steps.push({
          kind: 'onderstroom-typing',
          van: ins.van,
          naar: ins.naar,
          kanaal: ins.kanaal,
        });
      } else {
        const { afterIndex: _a, typIndicator: _t, ...line } = ins;
        steps.push({ kind: 'onderstroom', line });
      }
    }
    for (const blok of vraagAfterIndex(vragen, idx)) {
      for (const [sp, tx] of blok.lines) {
        steps.push({ kind: 'speech', speaker: sp, text: tx });
      }
    }
  });

  return steps;
}
