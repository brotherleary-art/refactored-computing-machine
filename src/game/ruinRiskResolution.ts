export type RuinApproach = 'cautious' | 'balanced' | 'reckless';

export interface RuinRiskInput {
  danger: number;
  heroPower: number;
  supplies: number;
  approach: RuinApproach;
  roll: number;
}

export interface RuinRiskResult {
  success: boolean;
  progress: number;
  suppliesSpent: number;
  injurySeverity: 'none' | 'light' | 'serious';
  relicChance: number;
}

const modifiers: Record<RuinApproach, { power: number; supply: number; progress: number; relic: number }> = {
  cautious: { power: 18, supply: 3, progress: 22, relic: 0.15 },
  balanced: { power: 8, supply: 2, progress: 30, relic: 0.25 },
  reckless: { power: -5, supply: 1, progress: 42, relic: 0.4 },
};

export function resolveRuinRisk(input: RuinRiskInput): RuinRiskResult {
  if (input.roll < 0 || input.roll > 1) throw new Error('INVALID_ROLL');
  const mode = modifiers[input.approach];
  if (input.supplies < mode.supply) throw new Error('INSUFFICIENT_SUPPLIES');
  const effectivePower = input.heroPower + mode.power;
  const threshold = Math.max(0.08, Math.min(0.92, 0.55 + (effectivePower - input.danger) / 140));
  const success = input.roll <= threshold;
  const gap = input.danger - effectivePower;
  const injurySeverity = success ? 'none' : gap > 25 ? 'serious' : 'light';
  return {
    success,
    progress: success ? mode.progress : Math.max(5, Math.floor(mode.progress / 3)),
    suppliesSpent: mode.supply,
    injurySeverity,
    relicChance: success ? mode.relic : 0,
  };
}
