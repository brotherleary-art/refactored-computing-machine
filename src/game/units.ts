export type UnitId = 'militia' | 'archer' | 'spearguard' | 'scout_rider' | 'sapper' | 'warden';
export type ResourceWallet = { food: number; timber: number; stone: number; clay: number; iron: number };

export interface UnitType {
  id: UnitId;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  requiredBuilding: string;
  cost: Partial<ResourceWallet>;
}

export const UNIT_TYPES: UnitType[] = [
  { id: 'militia', name: 'Ashfall Militia', attack: 4, defense: 5, speed: 3, requiredBuilding: 'barracks', cost: { food: 12, timber: 4 } },
  { id: 'archer', name: 'Ridge Archer', attack: 7, defense: 3, speed: 4, requiredBuilding: 'barracks', cost: { food: 10, timber: 8, iron: 2 } },
  { id: 'spearguard', name: 'Spearguard', attack: 5, defense: 8, speed: 2, requiredBuilding: 'barracks', cost: { food: 14, timber: 5, iron: 4 } },
  { id: 'scout_rider', name: 'Trail Rider', attack: 5, defense: 4, speed: 9, requiredBuilding: 'stable', cost: { food: 18, timber: 4, iron: 3 } },
  { id: 'sapper', name: 'Stone Sapper', attack: 8, defense: 4, speed: 2, requiredBuilding: 'forge', cost: { food: 12, timber: 6, stone: 5, iron: 6 } },
  { id: 'warden', name: 'Hold Warden', attack: 7, defense: 10, speed: 2, requiredBuilding: 'forge', cost: { food: 20, timber: 4, iron: 10 } },
];

const unitById = new Map(UNIT_TYPES.map((unit) => [unit.id, unit]));

export function canTrainUnit(id: UnitId, wallet: ResourceWallet, buildings: string[], count = 1): boolean {
  const unit = unitById.get(id);
  if (!unit || count < 1 || !Number.isInteger(count) || !buildings.includes(unit.requiredBuilding)) return false;
  return Object.entries(unit.cost).every(([resource, amount]) => wallet[resource as keyof ResourceWallet] >= (amount ?? 0) * count);
}

export function trainUnit(id: UnitId, count: number, wallet: ResourceWallet, buildings: string[]) {
  if (!canTrainUnit(id, wallet, buildings, count)) throw new Error(`Cannot train ${count} ${id}.`);
  const unit = unitById.get(id)!;
  const next = { ...wallet };
  for (const [resource, amount] of Object.entries(unit.cost)) next[resource as keyof ResourceWallet] -= (amount ?? 0) * count;
  return { units: count, wallet: next };
}
