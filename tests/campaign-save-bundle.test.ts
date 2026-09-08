import { describe, expect, it } from 'vitest';
import { createCampaignSave, restoreCampaignSave } from '../src/game/campaignSaveBundle';

describe('campaign save bundle', () => {
  it('round-trips hero, combat, and exploration state', () => {
    const save = createCampaignSave({
      playerId: 'p1', savedAt: '2026-09-08T00:00:00Z',
      hero: { id: 'sera', level: 3, hp: 41 },
      combat: { encounterId: 'guardian', turn: 4, enemyHp: 12, resolved: false },
      exploration: { visited: ['ashfall'], ruins: ['hollow-crown'], supplies: 6 },
    });
    const restored = restoreCampaignSave(JSON.stringify(save), 'p1');
    expect(restored).toEqual(save);
  });

  it('rejects cross-player and unsupported-version restores', () => {
    const save = createCampaignSave({
      playerId: 'p1', savedAt: '2026-09-08T00:00:00Z',
      hero: { id: 'sera', level: 1, hp: 20 },
      combat: { encounterId: null, turn: 0, enemyHp: 0, resolved: false },
      exploration: { visited: [], ruins: [], supplies: 3 },
    });
    expect(() => restoreCampaignSave(JSON.stringify(save), 'p2')).toThrow();
    expect(() => restoreCampaignSave(JSON.stringify({ ...save, version: 2 }), 'p1')).toThrow();
  });
});
