import { BUILDINGS, type BuildingId } from './buildings.js';
import type { ResourceWallet } from './resources.js';

export type BuildingLevels = Partial<Record<BuildingId, number>>;

export interface ReadinessStep {
  buildingId: BuildingId;
  label: string;
  targetLevel: number;
  blockedBy: string[];
  affordable: boolean;
}

export const requiredFoundation: BuildingId[] = [
  'townHall', 'farm', 'lumberCamp', 'quarry', 'storehouse', 'barracks', 'scoutLodge', 'infirmary', 'academy', 'expeditionHall'
];

const canAffordBaseCost = (wallet: ResourceWallet, id: BuildingId): boolean =>
  Object.entries(BUILDINGS[id].baseCost).every(([resource, amount]) => wallet[resource as keyof ResourceWallet] >= (amount ?? 0));

export function settlementReadiness(levels: BuildingLevels, wallet: ResourceWallet): {
  score: number;
  complete: boolean;
  next: ReadinessStep | null;
} {
  const completed = requiredFoundation.filter((id) => (levels[id] ?? 0) >= 1).length;
  const score = Math.round((completed / requiredFoundation.length) * 100);
  const missing = requiredFoundation.find((id) => (levels[id] ?? 0) < 1);
  if (!missing) return { score: 100, complete: true, next: null };

  const definition = BUILDINGS[missing];
  const blockedBy = Object.entries(definition.requires ?? {})
    .filter(([id, level]) => (levels[id as BuildingId] ?? 0) < (level ?? 0))
    .map(([id, level]) => `${BUILDINGS[id as BuildingId].label} Lv.${level}`);

  return {
    score,
    complete: false,
    next: {
      buildingId: missing,
      label: definition.label,
      targetLevel: 1,
      blockedBy,
      affordable: blockedBy.length === 0 && canAffordBaseCost(wallet, missing),
    },
  };
}
