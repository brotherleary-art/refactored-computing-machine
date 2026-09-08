import { describe, expect, it } from 'vitest';
import { resolveBattleAftermath } from '../src/game/battleAftermath.js';

describe('battle aftermath', () => {
  it('awards victory xp and morale when losses are light', () => {
    const result = resolveBattleAftermath({ victory: true, survivingPower: 85, startingPower: 100, heroIds: ['sera', 'bran'], battleId: 'cinder-host-1' });
    expect(result.moraleDelta).toBe(8);
    expect(result.heroes[0].xp).toBe(35);
    expect(result.requiresRecovery).toBe(false);
  });

  it('marks serious recovery after catastrophic losses and deduplicates heroes', () => {
    const result = resolveBattleAftermath({ victory: false, survivingPower: 20, startingPower: 100, heroIds: ['sera', 'sera'], battleId: 'ridge-ambush-2' });
    expect(result.heroes).toHaveLength(1);
    expect(result.heroes[0].injurySeverity).toBe('serious');
    expect(result.requiresRecovery).toBe(true);
    expect(result.moraleDelta).toBe(-10);
  });
});
