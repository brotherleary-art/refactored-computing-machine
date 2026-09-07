export interface RegionalBattleState {
  resolved: boolean;
  victory: boolean;
  playerForces: number;
}

export interface RegionalStatusInput {
  guardian: RegionalBattleState;
  brokenPike: RegionalBattleState;
  greyBanner: RegionalBattleState;
}

export type SafetyTier = 'fractured' | 'contested' | 'secured';

export interface RegionalStatus {
  safetyScore: number;
  tier: SafetyTier;
  clearedThreats: number;
  survivingForces: number;
  roadsSecured: boolean;
  summary: string;
}

export function calculateRegionalStatus(input: RegionalStatusInput): RegionalStatus {
  const battles = [input.guardian, input.brokenPike, input.greyBanner];
  const clearedThreats = battles.filter(b => b.resolved && b.victory).length;
  const survivingForces = battles
    .filter(b => b.resolved)
    .reduce((total, battle) => total + Math.max(0, battle.playerForces), 0);

  const safetyScore = Math.min(100, 18 + clearedThreats * 24 + Math.min(10, Math.floor(survivingForces / 8)));
  const tier: SafetyTier = safetyScore >= 72 ? 'secured' : safetyScore >= 42 ? 'contested' : 'fractured';
  const roadsSecured = input.brokenPike.resolved && input.brokenPike.victory && input.greyBanner.resolved && input.greyBanner.victory;

  const summary = tier === 'secured'
    ? 'Ashfall March is locally secured. Trade and civilian movement can resume under guard.'
    : tier === 'contested'
      ? 'Ashfall March is contested. Patrols hold some routes, but hostile movement remains.'
      : 'Ashfall March is fractured. Roads remain dangerous and Ashfall Hold is strategically isolated.';

  return { safetyScore, tier, clearedThreats, survivingForces, roadsSecured, summary };
}
