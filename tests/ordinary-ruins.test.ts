import { describe, expect, it } from 'vitest';
import { createRuinRun, resolveRuinStep, ORDINARY_RUINS } from '../src/game/ordinaryRuins';

describe('ordinary ruin expeditions', () => {
  it('defines three distinct playable ordinary ruins', () => {
    expect(Object.keys(ORDINARY_RUINS)).toHaveLength(3);
    expect(ORDINARY_RUINS['ruin-1'].name).toBe('The Sunken Watch');
  });

  it('advances a ruin with a hero-weighted choice and spends supplies', () => {
    const run = createRuinRun('ruin-1');
    const next = resolveRuinStep(run, 'Ilya Ren', 'study');
    expect(next.supplies).toBe(run.supplies - 1);
    expect(next.progress).toBeGreaterThan(run.progress);
  });

  it('grants a reward only once when a run completes', () => {
    let run = createRuinRun('ruin-1');
    while (!run.completed && run.supplies > 0) run = resolveRuinStep(run, 'Ilya Ren', 'study');
    expect(run.completed).toBe(true);
    const reward = run.rewardClaimed;
    const again = resolveRuinStep(run, 'Ilya Ren', 'study');
    expect(again.rewardClaimed).toBe(reward);
  });
});
