export type CombatReward = {
  food: number;
  timber: number;
  heroXp: number;
};

export type RewardLedger = {
  claimedBattleIds: string[];
};

export type CombatRewardClaim = {
  granted: CombatReward;
  ledger: RewardLedger;
};

export function claimCombatReward(ledger: RewardLedger, battleId: string, reward: CombatReward): CombatRewardClaim {
  const id = battleId.trim();
  if (!id) throw new Error('battleId is required');
  if (ledger.claimedBattleIds.includes(id)) throw new Error('battle reward already claimed');
  if ([reward.food, reward.timber, reward.heroXp].some(value => !Number.isFinite(value) || value < 0)) throw new Error('reward values must be non-negative');

  return {
    granted: { ...reward },
    ledger: { claimedBattleIds: [...ledger.claimedBattleIds, id] },
  };
}
