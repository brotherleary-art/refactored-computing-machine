import { describe, expect, it } from 'vitest';
import { restoreHeroCombat, saveHeroCombat, strikeEnemy } from '../src/game/heroCombatSession.js';

describe('hero combat session', () => {
  it('advances combat and restores the same player session', () => {
    const start = { playerId: 'p1', encounterId: 'guardian', revision: 0, turn: 1, heroes: [{ id: 'ivy', hp: 20, power: 7 }], enemyHp: 10, complete: false };
    const after = strikeEnemy(start, 'ivy');
    expect(after.enemyHp).toBe(3);
    expect(after.turn).toBe(2);
    expect(after.revision).toBe(1);
    expect(restoreHeroCombat(saveHeroCombat(after), 'p1').enemyHp).toBe(3);
  });

  it('rejects restoring combat for another player', () => {
    const payload = saveHeroCombat({ playerId: 'p1', encounterId: 'guardian', revision: 0, turn: 1, heroes: [], enemyHp: 10, complete: false });
    expect(() => restoreHeroCombat(payload, 'p2')).toThrow('another player');
  });
});
