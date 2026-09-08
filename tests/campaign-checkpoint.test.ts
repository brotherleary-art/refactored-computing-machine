import { describe, expect, it } from 'vitest';
import { acceptCheckpoint, createCheckpoint, recoverLatestCheckpoint } from '../src/game/campaignCheckpoint.js';

describe('campaign checkpoints', () => {
  it('accepts newer revisions and rejects stale or cross-player saves', () => {
    const current = createCheckpoint('p1', 4, { region: 'ashfall', hp: 20 }, 100);
    const incoming = createCheckpoint('p1', 5, { region: 'cinder', hp: 18 }, 200);
    expect(acceptCheckpoint(current, incoming, 'p1').revision).toBe(5);
    expect(() => acceptCheckpoint(incoming, current, 'p1')).toThrow(/stale/);
    expect(() => acceptCheckpoint(current, createCheckpoint('p2', 6, {}, 300), 'p1')).toThrow(/mismatch/);
  });

  it('recovers the highest valid revision for the player', () => {
    const local = createCheckpoint('p1', 7, { source: 'local' }, 200);
    const remote = createCheckpoint('p1', 8, { source: 'remote' }, 150);
    expect(recoverLatestCheckpoint(local, remote, 'p1')?.state).toEqual({ source: 'remote' });
  });
});
