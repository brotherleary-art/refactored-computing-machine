import { describe, expect, it } from 'vitest';
import { resumeVerticalSliceSession } from '../src/game/verticalSliceSession.js';

describe('resumeVerticalSliceSession', () => {
  it('restores only a matching player session and preserves battle state', () => {
    const snapshot = { playerId: 'p1', revision: 4, region: 'cinder-vale', hero: 'Sera Vale', battleTurn: 3, checksum: 'p1:4:cinder-vale:Sera Vale:3' };
    expect(resumeVerticalSliceSession(snapshot, 'p1').battleTurn).toBe(3);
    expect(() => resumeVerticalSliceSession(snapshot, 'p2')).toThrow('PLAYER_MISMATCH');
  });
});
