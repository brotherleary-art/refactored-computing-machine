import { describe, expect, it } from 'vitest';
import { BUILDING_UNLOCKS, evaluateBuildingUnlock, nextUnlockedBuilding } from '../src/game/buildingUnlocks.js';

describe('building unlock graph', () => {
  it('shows queued prerequisites as waiting blockers', () => {
    const barracks = BUILDING_UNLOCKS.find(rule => rule.id === 'barracks')!;
    const result = evaluateBuildingUnlock(barracks, {
      completed: ['hall'],
      queued: ['store'],
      settlementProgress: 50,
      relics: [],
    });
    expect(result.unlocked).toBe(false);
    expect(result.blockers).toContain('waiting:store');
  });

  it('requires the Guardian Shard before the forge unlocks', () => {
    const forge = BUILDING_UNLOCKS.find(rule => rule.id === 'forge')!;
    const state = { completed: ['hall', 'store', 'barracks'], queued: [], settlementProgress: 80, relics: [] as string[] };
    expect(evaluateBuildingUnlock(forge, state).blockers).toContain('relic:Guardian Shard');
    expect(evaluateBuildingUnlock(forge, { ...state, relics: ['Guardian Shard'] }).unlocked).toBe(true);
  });

  it('returns the first currently buildable structure', () => {
    expect(nextUnlockedBuilding({ completed: ['hall'], queued: [], settlementProgress: 25, relics: [] })).toBe('farm');
  });
});
