export interface TestEntitlementEvent {
  id: string;
  mode: 'test' | 'live';
  verified: boolean;
  type: 'purchase' | 'refund' | 'cancel';
  sku: string;
}

export function recoverTestEntitlementSession(events: TestEntitlementEvent[]) {
  const seen = new Set<string>();
  const active = new Set<string>();
  for (const event of events) {
    if (event.mode === 'live') throw new Error('LIVE_MODE_DISABLED');
    if (!event.verified) throw new Error('UNVERIFIED_EVENT');
    if (seen.has(event.id)) throw new Error('DUPLICATE_EVENT');
    seen.add(event.id);
    if (event.type === 'purchase') active.add(event.sku);
    else active.delete(event.sku);
  }
  return { activeSkus: [...active].sort(), processedEventIds: [...seen] };
}
