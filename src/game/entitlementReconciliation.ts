export interface EntitlementEvent {
  id: string;
  sequence: number;
  mode: 'test' | 'live';
  playerId: string;
  entitlementId: string;
  kind: 'grant' | 'revoke';
  grantsCombatPower?: boolean;
}

export interface ReconciledEntitlements {
  active: string[];
  processedEventIds: string[];
}

export const reconcileTestEntitlements = (
  playerId: string,
  events: EntitlementEvent[],
): ReconciledEntitlements => {
  const seen = new Set<string>();
  for (const event of events) {
    if (event.mode !== 'test') throw new Error('LIVE_EVENT_REJECTED');
    if (event.playerId !== playerId) throw new Error('PLAYER_MISMATCH');
    if (seen.has(event.id)) throw new Error('DUPLICATE_EVENT');
    if (event.grantsCombatPower) throw new Error('COMBAT_POWER_ENTITLEMENT_REJECTED');
    seen.add(event.id);
  }

  const active = new Set<string>();
  const ordered = [...events].sort((a, b) => a.sequence - b.sequence || a.id.localeCompare(b.id));
  for (const event of ordered) {
    if (event.kind === 'grant') active.add(event.entitlementId);
    else active.delete(event.entitlementId);
  }

  return {
    active: [...active].sort(),
    processedEventIds: ordered.map((event) => event.id),
  };
};
