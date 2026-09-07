import type { ResourceWallet } from './resources';

export type BuildingId =
  | 'townHall'
  | 'farm'
  | 'lumberCamp'
  | 'quarry'
  | 'clayPit'
  | 'ironMine'
  | 'storehouse'
  | 'granary'
  | 'barracks'
  | 'scoutLodge'
  | 'forge'
  | 'academy'
  | 'infirmary'
  | 'wall'
  | 'expeditionHall';

export interface BuildingDefinition {
  id: BuildingId;
  label: string;
  maxLevel: number;
  baseBuildSeconds: number;
  baseCost: Partial<ResourceWallet>;
  requires?: Partial<Record<BuildingId, number>>;
  unlocks?: string[];
}

export const BUILDINGS: Record<BuildingId, BuildingDefinition> = {
  townHall: { id: 'townHall', label: 'Town Hall', maxLevel: 10, baseBuildSeconds: 5, baseCost: { timber: 40, stone: 20 } },
  farm: { id: 'farm', label: 'Farm', maxLevel: 10, baseBuildSeconds: 5, baseCost: { timber: 20, clay: 10 }, requires: { townHall: 1 }, unlocks: ['food-production'] },
  lumberCamp: { id: 'lumberCamp', label: 'Lumber Camp', maxLevel: 10, baseBuildSeconds: 10, baseCost: { food: 15, stone: 5 }, requires: { townHall: 1 }, unlocks: ['timber-production'] },
  quarry: { id: 'quarry', label: 'Quarry', maxLevel: 10, baseBuildSeconds: 15, baseCost: { timber: 25, food: 15 }, requires: { lumberCamp: 1 }, unlocks: ['stone-production'] },
  clayPit: { id: 'clayPit', label: 'Clay Pit', maxLevel: 10, baseBuildSeconds: 20, baseCost: { timber: 20, food: 20 }, requires: { quarry: 1 }, unlocks: ['clay-production'] },
  ironMine: { id: 'ironMine', label: 'Iron Mine', maxLevel: 10, baseBuildSeconds: 30, baseCost: { timber: 40, stone: 30, food: 25 }, requires: { quarry: 1, storehouse: 1 }, unlocks: ['iron-production'] },
  storehouse: { id: 'storehouse', label: 'Storehouse', maxLevel: 10, baseBuildSeconds: 20, baseCost: { timber: 35, stone: 20 }, requires: { quarry: 1 }, unlocks: ['storage-protection'] },
  granary: { id: 'granary', label: 'Granary', maxLevel: 10, baseBuildSeconds: 25, baseCost: { timber: 30, clay: 15 }, requires: { farm: 1, storehouse: 1 }, unlocks: ['food-storage'] },
  barracks: { id: 'barracks', label: 'Barracks', maxLevel: 10, baseBuildSeconds: 30, baseCost: { timber: 50, stone: 35, food: 30 }, requires: { storehouse: 1 }, unlocks: ['militia', 'spearmen'] },
  scoutLodge: { id: 'scoutLodge', label: 'Scout Lodge', maxLevel: 10, baseBuildSeconds: 45, baseCost: { timber: 45, food: 30 }, requires: { barracks: 1 }, unlocks: ['scouts', 'fog-of-war'] },
  forge: { id: 'forge', label: 'Forge', maxLevel: 10, baseBuildSeconds: 60, baseCost: { timber: 60, stone: 50, iron: 20 }, requires: { ironMine: 1, barracks: 1 }, unlocks: ['equipment-crafting'] },
  academy: { id: 'academy', label: 'Academy', maxLevel: 10, baseBuildSeconds: 75, baseCost: { timber: 60, stone: 60, food: 40 }, requires: { scoutLodge: 1, townHall: 2 }, unlocks: ['research'] },
  infirmary: { id: 'infirmary', label: 'Infirmary', maxLevel: 10, baseBuildSeconds: 60, baseCost: { timber: 45, clay: 40, food: 35 }, requires: { barracks: 1, granary: 1 }, unlocks: ['wounded-recovery'] },
  wall: { id: 'wall', label: 'Wall', maxLevel: 10, baseBuildSeconds: 60, baseCost: { timber: 60, stone: 80 }, requires: { townHall: 1, quarry: 1 }, unlocks: ['settlement-defense'] },
  expeditionHall: { id: 'expeditionHall', label: 'Expedition Hall', maxLevel: 10, baseBuildSeconds: 90, baseCost: { timber: 80, stone: 60, iron: 25 }, requires: { scoutLodge: 1, academy: 1 }, unlocks: ['ruin-expeditions'] },
};

export const getScaledBuildSeconds = (building: BuildingDefinition, targetLevel: number): number =>
  Math.ceil(building.baseBuildSeconds * Math.pow(1.65, Math.max(0, targetLevel - 1)));

export const getScaledCost = (building: BuildingDefinition, targetLevel: number): Partial<ResourceWallet> =>
  Object.fromEntries(
    Object.entries(building.baseCost).map(([resource, amount]) => [resource, Math.ceil((amount ?? 0) * Math.pow(1.55, Math.max(0, targetLevel - 1)))])
  ) as Partial<ResourceWallet>;
