export interface BattleAftermathInput {
  victory: boolean;
  survivingPower: number;
  startingPower: number;
  heroIds: string[];
  battleId: string;
}

export interface HeroAftermath {
  heroId: string;
  xp: number;
  injurySeverity: 'none' | 'light' | 'serious';
}

export interface BattleAftermath {
  battleId: string;
  heroes: HeroAftermath[];
  moraleDelta: number;
  requiresRecovery: boolean;
}

export function resolveBattleAftermath(input: BattleAftermathInput): BattleAftermath {
  if (!input.battleId.trim()) throw new Error('BATTLE_ID_REQUIRED');
  if (input.startingPower <= 0) throw new Error('INVALID_STARTING_POWER');

  const survivalRatio = Math.max(0, Math.min(1, input.survivingPower / input.startingPower));
  const baseXp = input.victory ? 35 : 18;
  const injurySeverity: HeroAftermath['injurySeverity'] = survivalRatio < 0.35 ? 'serious' : survivalRatio < 0.7 ? 'light' : 'none';
  const heroes = [...new Set(input.heroIds)].map(heroId => ({
    heroId,
    xp: baseXp,
    injurySeverity,
  }));

  return {
    battleId: input.battleId,
    heroes,
    moraleDelta: input.victory ? 8 : -10,
    requiresRecovery: injurySeverity !== 'none',
  };
}
