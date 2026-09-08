import { describe, expect, it } from 'vitest';
import {
  claimEncounterReward,
  createMeridianGuardianEncounter,
  resolveMeridianGuardian,
} from '../src/game/encounters';

describe('Meridian Guardian encounter', () => {
  it('starts unresolved with both armies intact', () => {
    const state = createMeridianGuardianEncounter();
    expect(state.resolved).toBe(false);
    expect(state.playerArmy.reduce((n, s) => n + s.count, 0)).toBe(46);
    expect(state.enemyArmy.reduce((n, s) => n + s.count, 0)).toBe(26);
  });

  it('resolves deterministically and records losses', () => {
    const before = createMeridianGuardianEncounter();
    const after = resolveMeridianGuardian(before);
    expect(after.resolved).toBe(true);
    expect(after.lastResult).toBeDefined();
    expect(after.playerArmy.reduce((n, s) => n + s.count, 0)).toBeLessThan(46);
    expect(after.enemyArmy.reduce((n, s) => n + s.count, 0)).toBeLessThan(26);
  });

  it('does not resolve twice', () => {
    const once = resolveMeridianGuardian(createMeridianGuardianEncounter());
    const twice = resolveMeridianGuardian(once);
    expect(twice).toEqual(once);
  });

  it('allows a victory reward to be claimed only once', () => {
    const won = resolveMeridianGuardian(createMeridianGuardianEncounter());
    expect(won.victory).toBe(true);
    const claimed = claimEncounterReward(won);
    expect(claimed.rewardClaimed).toBe(true);
    expect(claimEncounterReward(claimed)).toEqual(claimed);
  });
});
