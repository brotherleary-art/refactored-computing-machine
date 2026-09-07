import { describe, expect, it } from 'vitest';
import { applyAuthoritativeSave, createAuthoritativeSave } from '../src/game/serverSaveAuthority.js';

describe('server save authority', () => {
  it('accepts only the current player and revision', () => {
    const current = createAuthoritativeSave('player-1', { food: 100 }, 1000);
    const accepted = applyAuthoritativeSave(current, { playerId: 'player-1', expectedRevision: 1, payload: { food: 90 } }, 2000);
    expect(accepted.accepted).toBe(true);
    if (accepted.accepted) expect(accepted.save.revision).toBe(2);

    const stale = applyAuthoritativeSave(current, { playerId: 'player-1', expectedRevision: 0, payload: { food: 9999 } }, 2000);
    expect(stale.accepted).toBe(false);
    if (!stale.accepted) expect(stale.reason).toBe('STALE_REVISION');

    const wrongPlayer = applyAuthoritativeSave(current, { playerId: 'player-2', expectedRevision: 1, payload: { food: 9999 } }, 2000);
    expect(wrongPlayer.accepted).toBe(false);
    if (!wrongPlayer.accepted) expect(wrongPlayer.reason).toBe('PLAYER_MISMATCH');
  });
});
