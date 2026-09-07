import { describe, expect, it } from 'vitest';
import { createFreshSave, recoverOrMigrateSave } from '../src/game/saveMigration';

describe('save migration', () => {
  it('creates a clean v2 save', () => {
    const save = createFreshSave('player-1', 100);
    expect(save.version).toBe(2);
    expect(save.campaign.regionId).toBe('ashfall-march');
  });

  it('migrates v1 data without discarding payload', () => {
    const result = recoverOrMigrateSave({
      version: 1,
      playerId: 'player-1',
      updatedAt: 50,
      payload: { food: 320, relics: ['Meridian Lens'] },
    }, 'player-1', 100);
    expect(result.migrated).toBe(true);
    expect(result.recoveredFromInvalid).toBe(false);
    expect(result.save.payload).toEqual({ food: 320, relics: ['Meridian Lens'] });
    expect(result.save.version).toBe(2);
  });

  it('recovers safely from invalid or wrong-player data', () => {
    const bad = recoverOrMigrateSave({ version: 2, playerId: 'someone-else', payload: {} }, 'player-1', 200);
    expect(bad.recoveredFromInvalid).toBe(true);
    expect(bad.save.playerId).toBe('player-1');
    expect(bad.save.version).toBe(2);
  });
});
