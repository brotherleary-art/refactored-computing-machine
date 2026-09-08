export type ResourceKey = 'food' | 'timber' | 'stone' | 'clay' | 'iron';

export interface ProductionSource {
  id: string;
  resource: ResourceKey;
  perMinute: number;
  damageModifier: number;
  staffed: boolean;
}

export type ResourceWallet = Record<ResourceKey, number>;

export interface ProductionTickResult {
  wallet: ResourceWallet;
  gained: ResourceWallet;
  wasted: ResourceWallet;
}

const KEYS: ResourceKey[] = ['food', 'timber', 'stone', 'clay', 'iron'];

export function applyProductionTick(
  wallet: ResourceWallet,
  storageCap: ResourceWallet,
  sources: ProductionSource[],
  minutes: number,
  moraleModifier = 1,
): ProductionTickResult {
  if (minutes < 0) throw new Error('Production time cannot be negative');
  const next = { ...wallet };
  const gained = Object.fromEntries(KEYS.map(k => [k, 0])) as ResourceWallet;
  const wasted = Object.fromEntries(KEYS.map(k => [k, 0])) as ResourceWallet;
  const safeMorale = Math.max(0, Math.min(1.5, moraleModifier));

  for (const source of sources) {
    if (!source.staffed || source.perMinute <= 0) continue;
    const modifier = Math.max(0, Math.min(1, source.damageModifier));
    const produced = source.perMinute * minutes * modifier * safeMorale;
    const room = Math.max(0, storageCap[source.resource] - next[source.resource]);
    const accepted = Math.min(room, produced);
    next[source.resource] += accepted;
    gained[source.resource] += accepted;
    wasted[source.resource] += produced - accepted;
  }

  return { wallet: next, gained, wasted };
}
