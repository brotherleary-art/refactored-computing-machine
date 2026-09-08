export type TestCommerceEvent = {
  id: string;
  playerId: string;
  mode: 'test' | 'live';
  verified: boolean;
  type: 'purchase' | 'refund' | 'cancel';
  entitlement: string;
};

export function recoverTestEntitlements(events: TestCommerceEvent[], playerId: string) {
  const active = new Set<string>();
  const processedEventIds: string[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    if (event.playerId !== playerId) continue;
    if (event.mode !== 'test') throw new Error('test-mode only');
    if (!event.verified) throw new Error('unverified event');
    if (seen.has(event.id)) continue;
    seen.add(event.id);
    processedEventIds.push(event.id);

    if (event.type === 'purchase') active.add(event.entitlement);
    else active.delete(event.entitlement);
  }

  return { activeEntitlements: [...active].sort(), processedEventIds };
}
