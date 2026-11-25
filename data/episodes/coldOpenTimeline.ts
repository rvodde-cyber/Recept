import type { ColdOpenDef } from './content';
import type { ColdTimelineStep, OnderstroomInsert, VraagregelBlock } from './coldOpenModel';
import { onderstroomMessageKey } from './coldOpenModel';

function uniqInserts(inserts: readonly OnderstroomInsert[] | undefined): readonly OnderstroomInsert[] {
  if (!inserts?.length) return [];
  const seen = new Set<string>();
  const out: OnderstroomInsert[] = [];
  for (const ins of inserts) {
    const key = ins.typIndicator
      ? `typing:${ins.afterIndex}\u001f${ins.kanaal}\u001f${ins.van}\u001f${ins.naar ?? ''}`
      : `msg:${ins.afterIndex}\u001f${onderstroomMessageKey(ins)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ins);
  }
  return out;
}

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
  const inserts = onderstroomActief ? uniqInserts(def.onderstroom) : undefined;
  const vragen = vraagregelActief ? def.vraagregels : undefined;
  const seenOnderstroom = new Set<string>();

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
        const msgKey = onderstroomMessageKey(line);
        if (seenOnderstroom.has(msgKey)) continue;
        seenOnderstroom.add(msgKey);
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
