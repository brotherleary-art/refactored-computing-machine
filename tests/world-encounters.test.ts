import { describe, expect, it } from 'vitest';
import {
  claimWorldEncounterReward,
  createWorldEncounter,
  resolveWorldEncounter,
  WORLD_ENCOUNTERS,
} from '../src/game/worldEncounters';

describe('world PvE encounters', () => {
  it('creates Broken Pike Camp from its definition', () => {
    const state = createWorldEncounter('broken-pike-camp');
    expect(state.resolved).toBe(false);
    expect(state.enemyArmy).toEqual(WORLD_ENCOUNTERS['broken-pike-camp'].enemyArmy);
    expect(state.playerArmy.reduce((sum, unit) => sum + unit.count, 0)).toBe(38);
  });

  it('resolves a camp battle exactly once', () => {
    const initial = createWorldEncounter('broken-pike-camp');
    const resolved = resolveWorldEncounter(initial, 'sera-vale');
    const repeated = resolveWorldEncounter(resolved, 'sera-vale');
    expect(resolved.resolved).toBe(true);
    expect(resolved.lastResult).toBeDefined();
    expect(repeated).toBe(resolved);
  });

  it('preserves casualties after resolution', () => {
    const initial = createWorldEncounter('grey-banner-patrol');
    const beforePlayer = initial.playerArmy.reduce((sum, unit) => sum + unit.count, 0);
    const beforeEnemy = initial.enemyArmy.reduce((sum, unit) => sum + unit.count, 0);
    const resolved = resolveWorldEncounter(initial, 'sera-vale');
    const afterPlayer = resolved.playerArmy.reduce((sum, unit) => sum + unit.count, 0);
    const afterEnemy = resolved.enemyArmy.reduce((sum, unit) => sum + unit.count, 0);
    expect(afterPlayer).toBeLessThanOrEqual(beforePlayer);
    expect(afterEnemy).toBeLessThanOrEqual(beforeEnemy);
  });

  it('allows a victory reward to be claimed only once', () => {
    const state = createWorldEncounter('broken-pike-camp');
    const resolved = resolveWorldEncounter(state, 'sera-vale');
    if (!resolved.victory) return;
    const claimed = claimWorldEncounterReward(resolved);
    const repeated = claimWorldEncounterReward(claimed);
    expect(claimed.rewardClaimed).toBe(true);
    expect(repeated).toBe(claimed);
  });
});
