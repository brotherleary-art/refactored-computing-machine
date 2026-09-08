import { describe, expect, it } from 'vitest';
import { appendCampaignSnapshot, latestCampaignSnapshot, rollbackCampaignSnapshot } from '../src/game/campaignSnapshotRing';

describe('campaign snapshot ring', () => {
  it('keeps a bounded history with monotonically increasing revisions', () => {
    let snapshots = appendCampaignSnapshot([], { hp: 10 }, 100, 2);
    snapshots = appendCampaignSnapshot(snapshots, { hp: 8 }, 200, 2);
    snapshots = appendCampaignSnapshot(snapshots, { hp: 6 }, 300, 2);
    expect(snapshots.map((s) => s.revision)).toEqual([2, 3]);
    expect(latestCampaignSnapshot(snapshots).state.hp).toBe(6);
  });

  it('recovers an older retained revision for rollback', () => {
    const snapshots = [
      { revision: 4, savedAt: 400, state: { hero: 'Mara', hp: 7 } },
      { revision: 5, savedAt: 500, state: { hero: 'Mara', hp: 2 } },
    ];
    expect(rollbackCampaignSnapshot(snapshots, 4).state.hp).toBe(7);
    expect(() => rollbackCampaignSnapshot(snapshots, 3)).toThrow(/not found/);
  });
});
