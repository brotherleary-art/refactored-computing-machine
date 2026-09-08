export type CommerceEventType = 'purchase' | 'renewal' | 'refund' | 'cancel';

export interface CommerceEvent {
  eventId: string;
  playerId: string;
  entitlementId: string;
  type: CommerceEventType;
  verified: boolean;
  testMode: boolean;
}

export interface CommerceLedgerState {
  processedEventIds: string[];
  activeEntitlements: string[];
}

export function applyCommerceEvent(state: CommerceLedgerState, event: CommerceEvent): CommerceLedgerState {
  if (!event.testMode) throw new Error('LIVE_COMMERCE_DISABLED');
  if (!event.verified) throw new Error('UNVERIFIED_COMMERCE_EVENT');
  if (state.processedEventIds.includes(event.eventId)) throw new Error('COMMERCE_REPLAY');

  const active = new Set(state.activeEntitlements);
  if (event.type === 'purchase' || event.type === 'renewal') active.add(event.entitlementId);
  if (event.type === 'refund' || event.type === 'cancel') active.delete(event.entitlementId);

  return {
    processedEventIds: [...state.processedEventIds, event.eventId],
    activeEntitlements: [...active].sort(),
  };
}

export function commerceChangesCombatPower(): false {
  return false;
}
