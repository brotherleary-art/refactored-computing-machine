import { BUILDINGS, getScaledBuildSeconds, getScaledCost, type BuildingId } from './buildings.js';
import { spendResources, type ResourceWallet } from './resources.js';

export interface ConstructionOrder {
  buildingId: BuildingId;
  targetLevel: number;
  readyAt: number;
}

export type BuildingLevels = Partial<Record<BuildingId, number>>;

export const canConstruct = (buildingId: BuildingId, levels: BuildingLevels): boolean => {
  const def = BUILDINGS[buildingId];
  const current = levels[buildingId] ?? 0;
  if (current >= def.maxLevel) return false;
  return Object.entries(def.requires ?? {}).every(([id, level]) => (levels[id as BuildingId] ?? 0) >= (level ?? 0));
};

export const queueConstruction = (
  queue: ConstructionOrder[],
  buildingId: BuildingId,
  levels: BuildingLevels,
  wallet: ResourceWallet,
  now: number
): { queue: ConstructionOrder[]; wallet: ResourceWallet } => {
  if (queue.some(order => order.buildingId === buildingId)) throw new Error('BUILDING_ALREADY_QUEUED');
  if (!canConstruct(buildingId, levels)) throw new Error('PREREQUISITES_NOT_MET');
  const targetLevel = (levels[buildingId] ?? 0) + 1;
  const cost = getScaledCost(BUILDINGS[buildingId], targetLevel);
  return {
    wallet: spendResources(wallet, cost),
    queue: [...queue, { buildingId, targetLevel, readyAt: now + getScaledBuildSeconds(BUILDINGS[buildingId], targetLevel) * 1000 }],
  };
};

export const completeConstruction = (
  queue: ConstructionOrder[],
  levels: BuildingLevels,
  now: number
): { queue: ConstructionOrder[]; levels: BuildingLevels } => {
  const nextLevels = { ...levels };
  const remaining: ConstructionOrder[] = [];
  for (const order of queue) {
    if (order.readyAt <= now) nextLevels[order.buildingId] = Math.max(nextLevels[order.buildingId] ?? 0, order.targetLevel);
    else remaining.push(order);
  }
  return { queue: remaining, levels: nextLevels };
};
