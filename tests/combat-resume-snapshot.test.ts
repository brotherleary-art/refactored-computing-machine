import { describe, expect, it } from 'vitest';
import { createCombatSnapshot, restoreCombatSnapshot } from '../src/game/combatResumeSnapshot.js';

describe('combat resume snapshots', () => {
  it('creates and restores a player-bound unresolved encounter', () => {
    const snapshot = createCombatSnapshot({
      playerId: 'player-1',
      encounterId: 'guardian',
      turn: 3,
      playerForces: 31,
      enemyForces: 14,
      heroIds: ['sera', 'mara'],
      resolved: false,
      revision: 7,
    });

    const restored = restoreCombatSnapshot(snapshot, 'player-1');
    expect(restored.turn).toBe(3);
    expect(restored.enemyForces).toBe(14);
    expect(restored.revision).toBe(7);
  });

  it('rejects cross-player restore attempts', () => {
    const snapshot = createCombatSnapshot({
      playerId: 'player-1', encounterId: 'guardian', turn: 1,
      playerForces: 40, enemyForces: 20, heroIds: ['sera'], resolved: false, revision: 1,
    });

    expect(() => restoreCombatSnapshot(snapshot, 'player-2')).toThrow('player mismatch');
  });
});
