export interface TestCommerceEvent {
  id: string;
  playerId: string;
  offerId: string;
  type: 'purchase' | 'refund';
  verified: boolean;
  live: boolean;
}

export function restoreTestEntitlements(events: TestCommerceEvent[], playerId: string): string[] {
  const seen = new Set<string>();
  const active = new Set<string>();
  for (const event of events) {
    if (seen.has(event.id)) continue;
    seen.add(event.id);
    if (event.playerId !== playerId) continue;
    if (event.live) throw new Error('live commerce is disabled');
    if (!event.verified) continue;
    if (event.type === 'purchase') active.add(event.offerId);
    else active.delete(event.offerId);
  }
  return [...active].sort();
}

export function canEquipCosmetic(entitlements: string[], offerId: string): boolean {
  return entitlements.includes(offerId);
}
