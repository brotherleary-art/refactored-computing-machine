import { describe, expect, it } from 'vitest';
import { claimCombatReward, type RewardLedger } from '../src/game/combatRewardClaim';

describe('combat reward claims', () => {
  it('grants resources and hero xp exactly once per battle id', () => {
    const ledger: RewardLedger = { claimedBattleIds: [] };
    const reward = { food: 40, timber: 25, heroXp: 30 };
    const first = claimCombatReward(ledger, 'battle-001', reward);
    expect(first.granted).toEqual(reward);
    expect(first.ledger.claimedBattleIds).toContain('battle-001');
    expect(() => claimCombatReward(first.ledger, 'battle-001', reward)).toThrow();
  });

  it('rejects empty battle identifiers', () => {
    expect(() => claimCombatReward({ claimedBattleIds: [] }, '', { food: 1, timber: 1, heroXp: 1 })).toThrow();
  });
});
