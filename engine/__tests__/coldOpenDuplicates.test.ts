import { describe, expect, it } from 'vitest';
import { episodeMeta, type EpisodeId } from '@data/episodes/meta';
import { episodeContent } from '@data/episodes/content';
import { buildColdTimeline } from '@data/episodes/coldOpenTimeline';
import { coldOpenTimelineForRound } from '@data/episodes/coldOpenFlow';
import { COLD_OPEN_EP5 } from '@data/episodes/coldOpenEp5';
import { onderstroomMessageKey } from '@data/episodes/coldOpenModel';

function onderstroomSignatures(episode: EpisodeId, round: 1 | 2): string[] {
  const steps = coldOpenTimelineForRound(episode, round);
  return steps
    .filter((s): s is Extract<typeof s, { kind: 'onderstroom' }> => s.kind === 'onderstroom')
    .map((s) => onderstroomMessageKey(s.line));
}

describe('cold open — geen dubbele onderstroomberichten', () => {
  it.each([1, 2, 3, 4, 5] as const)('A%i: unieke onderstroom-teksten per ronde', (ep) => {
    for (const round of [1, 2] as const) {
      if (!episodeContent(ep).coldOpen[round]) continue;
      const sigs = onderstroomSignatures(ep, round);
      expect(new Set(sigs).size).toBe(sigs.length);
    }
  });

  it('A5 r1: Piotr/Anne-Fleur-teksten één keer in data en timeline', () => {
    const raw = COLD_OPEN_EP5[1].onderstroom ?? [];
    const texts = raw.map((i) => i.tekst);
    expect(texts.filter((t) => t === 'Dat vertel ik je liever buiten de vergadering.')).toHaveLength(1);
    expect(texts.filter((t) => t === 'Vanavond bij de schuur?')).toHaveLength(1);
    const steps = coldOpenTimelineForRound(5, 1);
    const onder = steps
      .filter((s): s is Extract<typeof s, { kind: 'onderstroom' }> => s.kind === 'onderstroom')
      .map((s) => s.line.tekst);
    expect(onder).toEqual([
      'Weet jij wat erin staat?',
      'Dat vertel ik je liever buiten de vergadering.',
      'Vanavond bij de schuur?',
    ]);
  });

  it('dubbele inserts in register → één timeline-stap per bericht', () => {
    const duped = {
      ...COLD_OPEN_EP5[1],
      onderstroom: [
        ...(COLD_OPEN_EP5[1].onderstroom ?? []),
        ...(COLD_OPEN_EP5[1].onderstroom ?? []).slice(1, 3),
      ],
    };
    const steps = buildColdTimeline(duped, true, true);
    const onder = steps.filter((s) => s.kind === 'onderstroom');
    expect(onder).toHaveLength(3);
    const texts = onder.map((s) => (s.kind === 'onderstroom' ? s.line.tekst : ''));
    expect(texts.filter((t) => t === 'Dat vertel ik je liever buiten de vergadering.')).toHaveLength(1);
    expect(texts.filter((t) => t === 'Vanavond bij de schuur?')).toHaveLength(1);
  });

  it('alle afleveringen: episode-meta bestaat', () => {
    for (const ep of [1, 2, 3, 4, 5] as const) {
      expect(episodeMeta(ep).titel.length).toBeGreaterThan(0);
    }
  });
});