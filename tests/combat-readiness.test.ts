import { describe, expect, it } from 'vitest';
import { assessCombatReadiness } from '../src/game/combatReadiness';

describe('combat readiness', () => {
  it('blocks deployment when every hero is unavailable', () => {
    const result = assessCombatReadiness({
      heroes: [
        { id: 'sera', power: 24, assignment: 'scouting' },
        { id: 'tor', power: 30, injuredUntil: 10_000 },
      ],
      nowMs: 5_000,
      trainedUnits: 12,
      rations: 10,
      enemyPower: 40,
    });
    expect(result.ready).toBe(false);
    expect(result.reasons).toContain('NO_AVAILABLE_HERO');
  });

  it('reports deployable power and warns when the squad is understrength', () => {
    const result = assessCombatReadiness({
      heroes: [{ id: 'sera', power: 24 }],
      nowMs: 5_000,
      trainedUnits: 8,
      rations: 4,
      enemyPower: 50,
    });
    expect(result.ready).toBe(true);
    expect(result.deployablePower).toBe(32);
    expect(result.reasons).toContain('UNDERSTRENGTH');
  });
});
