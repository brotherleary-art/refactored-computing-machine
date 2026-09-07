import { describe, expect, it } from 'vitest';
import { evaluateCampaignGate } from '../src/game/campaignGate';

describe('campaign gate', () => {
  it('keeps a fresh settlement in survival', () => {
    const result = evaluateCampaignGate({
      settlementProgress: 30,
      ruinCompleted: false,
      guardianDefeated: false,
      clearedWorldThreats: 0,
      relics: [],
    });
    expect(result.phase).toBe('survival');
    expect(result.nextRegionUnlocked).toBe(false);
  });

  it('moves discovery into security after the Guardian falls', () => {
    const result = evaluateCampaignGate({
      settlementProgress: 65,
      ruinCompleted: true,
      guardianDefeated: true,
      clearedWorldThreats: 1,
      relics: ['Meridian Lens'],
    });
    expect(result.phase).toBe('security');
    expect(result.missing).toContain('Clear both hostile road forces.');
  });

  it('unlocks expansion only when the vertical-slice objectives are satisfied', () => {
    const result = evaluateCampaignGate({
      settlementProgress: 82,
      ruinCompleted: true,
      guardianDefeated: true,
      clearedWorldThreats: 2,
      relics: ['Meridian Lens', 'Guardian Shard'],
    });
    expect(result.phase).toBe('expansion_ready');
    expect(result.nextRegionUnlocked).toBe(true);
    expect(result.missing).toHaveLength(0);
  });
});
