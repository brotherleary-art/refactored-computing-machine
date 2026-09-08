export interface CombatHero {
  id: string;
  power: number;
  assignment?: string;
  injuredUntil?: number;
}

export interface CombatReadinessInput {
  heroes: CombatHero[];
  nowMs: number;
  trainedUnits: number;
  rations: number;
  enemyPower: number;
}

export interface CombatReadinessResult {
  ready: boolean;
  deployablePower: number;
  availableHeroIds: string[];
  reasons: string[];
}

export const assessCombatReadiness = (input: CombatReadinessInput): CombatReadinessResult => {
  const availableHeroes = input.heroes.filter(
    (hero) => !hero.assignment && (!hero.injuredUntil || hero.injuredUntil <= input.nowMs),
  );
  const deployablePower = availableHeroes.reduce((total, hero) => total + hero.power, 0) + Math.max(0, input.trainedUnits);
  const reasons: string[] = [];
  if (!availableHeroes.length) reasons.push('NO_AVAILABLE_HERO');
  if (input.rations <= 0) reasons.push('NO_RATIONS');
  if (deployablePower < input.enemyPower) reasons.push('UNDERSTRENGTH');
  return {
    ready: availableHeroes.length > 0 && input.rations > 0,
    deployablePower,
    availableHeroIds: availableHeroes.map((hero) => hero.id),
    reasons,
  };
};
