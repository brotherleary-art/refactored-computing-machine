import { describe, expect, it } from 'vitest';
import { getCurrentObjective, getObjectives } from '../src/game/objectives';

const base = { progress: 18, ruinExposed: false, expeditionCompleted: false, guardianVictory: false, brokenPikeVictory: false, greyBannerVictory: false };

describe('vertical-slice objectives', () => {
  it('starts with stabilizing Ashfall Hold', () => {
    expect(getCurrentObjective(base).id).toBe('stabilize_hold');
  });

  it('advances through ruin and guardian milestones', () => {
    expect(getCurrentObjective({ ...base, progress: 60, ruinExposed: true, expeditionCompleted: true }).id).toBe('defeat_guardian');
  });

  it('requires both road threats for secure-roads completion', () => {
    const objectives = getObjectives({ ...base, progress: 60, ruinExposed: true, expeditionCompleted: true, guardianVictory: true, brokenPikeVictory: true });
    expect(objectives.find(o => o.id === 'secure_roads')?.complete).toBe(false);
  });
});
