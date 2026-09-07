import { BUILDINGS, getScaledBuildSeconds, getScaledCost, type BuildingId } from './buildings';
import { createStartingWallet, spendResources, type ResourceWallet } from './resources';

export interface BuildOrder {
  buildingId: BuildingId;
  targetLevel: number;
  startedAt: number;
  completesAt: number;
}

export interface SettlementState {
  wallet: ResourceWallet;
  buildings: Partial<Record<BuildingId, number>>;
  queue: BuildOrder[];
  lastTickAt: number;
}

export const createSettlementState = (now = Date.now()): SettlementState => ({
  wallet: createStartingWallet(),
  buildings: { townHall: 1 },
  queue: [],
  lastTickAt: now,
});

export const canUpgrade = (state: SettlementState, buildingId: BuildingId): { ok: boolean; reason?: string } => {
  const def = BUILDINGS[buildingId];
  const currentLevel = state.buildings[buildingId] ?? 0;
  const targetLevel = currentLevel + 1;
  if (targetLevel > def.maxLevel) return { ok: false, reason: 'MAX_LEVEL' };
  if (state.queue.some(order => order.buildingId === buildingId)) return { ok: false, reason: 'ALREADY_QUEUED' };
  for (const [requiredId, requiredLevel] of Object.entries(def.requires ?? {})) {
    if ((state.buildings[requiredId as BuildingId] ?? 0) < (requiredLevel ?? 0)) return { ok: false, reason: `REQUIRES_${requiredId}_${requiredLevel}` };
  }
  const cost = getScaledCost(def, targetLevel);
  for (const [resource, amount] of Object.entries(cost)) {
    if (state.wallet[resource as keyof ResourceWallet] < (amount ?? 0)) return { ok: false, reason: `NEEDS_${resource}` };
  }
  return { ok: true };
};

export const queueUpgrade = (state: SettlementState, buildingId: BuildingId, now = Date.now()): SettlementState => {
  const check = canUpgrade(state, buildingId);
  if (!check.ok) throw new Error(check.reason);
  const def = BUILDINGS[buildingId];
  const targetLevel = (state.buildings[buildingId] ?? 0) + 1;
  const durationMs = getScaledBuildSeconds(def, targetLevel) * 1000;
  return {
    ...state,
    wallet: spendResources(state.wallet, getScaledCost(def, targetLevel)),
    queue: [...state.queue, { buildingId, targetLevel, startedAt: now, completesAt: now + durationMs }],
  };
};

export const applyTick = (state: SettlementState, now = Date.now()): SettlementState => {
  const elapsedSeconds = Math.max(0, (now - state.lastTickAt) / 1000);
  const productionPerSecond = {
    food: (state.buildings.farm ?? 0) * 0.8,
    timber: (state.buildings.lumberCamp ?? 0) * 0.65,
    stone: (state.buildings.quarry ?? 0) * 0.45,
    clay: (state.buildings.clayPit ?? 0) * 0.35,
    iron: (state.buildings.ironMine ?? 0) * 0.18,
  };
  const wallet = { ...state.wallet };
  for (const [resource, rate] of Object.entries(productionPerSecond)) {
    wallet[resource as keyof ResourceWallet] += rate * elapsedSeconds;
  }
  const completed = state.queue.filter(order => order.completesAt <= now);
  const buildings = { ...state.buildings };
  for (const order of completed) buildings[order.buildingId] = Math.max(buildings[order.buildingId] ?? 0, order.targetLevel);
  return {
    wallet,
    buildings,
    queue: state.queue.filter(order => order.completesAt > now),
    lastTickAt: now,
  };
};
