export type MoraleTier = 'breaking' | 'strained' | 'steady' | 'resolute';

export interface MoraleInput {
  foodHours: number;
  damagedBuildings: number;
  securedRoads: boolean;
  recentVictory: boolean;
  population: number;
  shelterCapacity: number;
}

export interface MoraleResult {
  score: number;
  tier: MoraleTier;
  productionMultiplier: number;
  desertionRisk: boolean;
  reasons: string[];
}

export function evaluateSettlementMorale(input: MoraleInput): MoraleResult {
  let score = 55;
  const reasons: string[] = [];

  if (input.foodHours >= 12) { score += 15; reasons.push('food-secure'); }
  else if (input.foodHours < 4) { score -= 25; reasons.push('food-critical'); }
  else if (input.foodHours < 8) { score -= 10; reasons.push('food-low'); }

  score -= Math.min(24, Math.max(0, input.damagedBuildings) * 6);
  if (input.damagedBuildings > 0) reasons.push('damaged-buildings');

  if (input.securedRoads) { score += 10; reasons.push('roads-secured'); }
  else reasons.push('roads-unsafe');

  if (input.recentVictory) { score += 12; reasons.push('recent-victory'); }

  if (input.population > input.shelterCapacity) {
    score -= Math.min(20, (input.population - input.shelterCapacity) * 2);
    reasons.push('overcrowded');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const tier: MoraleTier = score < 25 ? 'breaking' : score < 50 ? 'strained' : score < 75 ? 'steady' : 'resolute';
  const productionMultiplier = tier === 'breaking' ? 0.7 : tier === 'strained' ? 0.85 : tier === 'steady' ? 1 : 1.1;

  return { score, tier, productionMultiplier, desertionRisk: score < 20, reasons };
}
