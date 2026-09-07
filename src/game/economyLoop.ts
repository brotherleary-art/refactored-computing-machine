import type { BuildingId } from './buildings';
import type { ResourceWallet } from './resources';

export interface EconomySnapshot {
  wallet: ResourceWallet;
  buildings: Partial<Record<BuildingId, number>>;
  lastTickAt: number;
}

export const MAX_OFFLINE_SECONDS = 4 * 60 * 60;

const BASE_CAPACITY: ResourceWallet = { food: 300, timber: 300, stone: 300, clay: 300, iron: 300, population: 100 };
const STOREHOUSE_CAPACITY_PER_LEVEL = 200;

export const getStorageCapacity = (buildings: Partial<Record<BuildingId, number>>): ResourceWallet => {
  const bonus = (buildings.storehouse ?? 0) * STOREHOUSE_CAPACITY_PER_LEVEL;
  return {
    food: BASE_CAPACITY.food + bonus,
    timber: BASE_CAPACITY.timber + bonus,
    stone: BASE_CAPACITY.stone + bonus,
    clay: BASE_CAPACITY.clay + bonus,
    iron: BASE_CAPACITY.iron + bonus,
    population: BASE_CAPACITY.population,
  };
};

export const getProductionPerSecond = (buildings: Partial<Record<BuildingId, number>>): ResourceWallet => ({
  food: (buildings.farm ?? 0) * 0.8,
  timber: (buildings.lumberCamp ?? 0) * 0.65,
  stone: (buildings.quarry ?? 0) * 0.45,
  clay: (buildings.clayPit ?? 0) * 0.35,
  iron: (buildings.ironMine ?? 0) * 0.18,
  population: 0,
});

export const applyEconomyTick = (state: EconomySnapshot, now = Date.now()): EconomySnapshot => {
  const elapsedSeconds = Math.min(MAX_OFFLINE_SECONDS, Math.max(0, (now - state.lastTickAt) / 1000));
  const rates = getProductionPerSecond(state.buildings);
  const capacity = getStorageCapacity(state.buildings);
  const wallet = { ...state.wallet };

  for (const resource of Object.keys(wallet) as (keyof ResourceWallet)[]) {
    wallet[resource] = Math.min(capacity[resource], wallet[resource] + rates[resource] * elapsedSeconds);
  }

  return { ...state, wallet, lastTickAt: now };
};
