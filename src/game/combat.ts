import { Hero, effectiveHeroPower } from './heroes';

export type UnitId = 'militia' | 'spearmen' | 'archers' | 'scouts' | 'cavalry' | 'engineers';

export interface ArmyStack {
  unit: UnitId;
  count: number;
}

export interface BattleSide {
  name: string;
  commander?: Hero;
  army: ArmyStack[];
  morale: number;
  terrainBonus?: number;
  fortificationBonus?: number;
}

export interface BattleResult {
  winner: 'attacker' | 'defender';
  attackerScore: number;
  defenderScore: number;
  attackerLossRate: number;
  defenderLossRate: number;
  summary: string;
}

const UNIT_POWER: Record<UnitId, number> = {
  militia: 1,
  spearmen: 2.2,
  archers: 2.4,
  scouts: 1.4,
  cavalry: 3.8,
  engineers: 1.1,
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export const armyPower = (side: BattleSide): number => {
  const unitPower = side.army.reduce((total, stack) => total + UNIT_POWER[stack.unit] * stack.count, 0);
  const commanderPower = side.commander ? effectiveHeroPower(side.commander) * 2.5 : 0;
  const moraleModifier = clamp(side.morale, 20, 100) / 100;
  const terrainModifier = 1 + (side.terrainBonus ?? 0);
  const fortificationModifier = 1 + (side.fortificationBonus ?? 0);
  return Math.round((unitPower + commanderPower) * moraleModifier * terrainModifier * fortificationModifier);
};

export const resolveBattle = (attacker: BattleSide, defender: BattleSide): BattleResult => {
  const attackerScore = armyPower(attacker);
  const defenderScore = armyPower(defender);
  const winner = attackerScore > defenderScore ? 'attacker' : 'defender';
  const stronger = Math.max(attackerScore, defenderScore, 1);
  const weaker = Math.min(attackerScore, defenderScore);
  const closeness = weaker / stronger;

  const winnerLoss = clamp(0.08 + closeness * 0.22, 0.08, 0.3);
  const loserLoss = clamp(0.35 + closeness * 0.35, 0.35, 0.7);

  const attackerLossRate = winner === 'attacker' ? winnerLoss : loserLoss;
  const defenderLossRate = winner === 'defender' ? winnerLoss : loserLoss;

  return {
    winner,
    attackerScore,
    defenderScore,
    attackerLossRate: Number(attackerLossRate.toFixed(2)),
    defenderLossRate: Number(defenderLossRate.toFixed(2)),
    summary:
      winner === 'attacker'
        ? `${attacker.name} breaks ${defender.name}'s position.`
        : `${defender.name} holds against ${attacker.name}.`,
  };
};

export const applyLosses = (army: ArmyStack[], lossRate: number): ArmyStack[] =>
  army
    .map((stack) => ({ ...stack, count: Math.max(0, Math.round(stack.count * (1 - lossRate))) }))
    .filter((stack) => stack.count > 0);
