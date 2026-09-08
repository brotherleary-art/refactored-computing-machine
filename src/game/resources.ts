export type ResourceId =
  | 'food'
  | 'timber'
  | 'stone'
  | 'clay'
  | 'iron'
  | 'population';

export interface ResourceDefinition {
  id: ResourceId;
  label: string;
  startingAmount: number;
  baseStorage: number;
  protectedRatio: number;
}

export const RESOURCES: Record<ResourceId, ResourceDefinition> = {
  food: { id: 'food', label: 'Food', startingAmount: 500, baseStorage: 1000, protectedRatio: 0.25 },
  timber: { id: 'timber', label: 'Timber', startingAmount: 400, baseStorage: 1000, protectedRatio: 0.25 },
  stone: { id: 'stone', label: 'Stone', startingAmount: 250, baseStorage: 800, protectedRatio: 0.25 },
  clay: { id: 'clay', label: 'Clay', startingAmount: 150, baseStorage: 600, protectedRatio: 0.25 },
  iron: { id: 'iron', label: 'Iron', startingAmount: 80, baseStorage: 400, protectedRatio: 0.35 },
  population: { id: 'population', label: 'Population', startingAmount: 24, baseStorage: 100, protectedRatio: 1 },
};

export type ResourceWallet = Record<ResourceId, number>;

export const createStartingWallet = (): ResourceWallet =>
  Object.values(RESOURCES).reduce((wallet, resource) => {
    wallet[resource.id] = resource.startingAmount;
    return wallet;
  }, {} as ResourceWallet);

export const hasResources = (wallet: ResourceWallet, cost: Partial<ResourceWallet>): boolean =>
  Object.entries(cost).every(([id, amount]) => wallet[id as ResourceId] >= (amount ?? 0));

export const spendResources = (wallet: ResourceWallet, cost: Partial<ResourceWallet>): ResourceWallet => {
  if (!hasResources(wallet, cost)) throw new Error('INSUFFICIENT_RESOURCES');
  const next = { ...wallet };
  for (const [id, amount] of Object.entries(cost)) next[id as ResourceId] -= amount ?? 0;
  return next;
};
