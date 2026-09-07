import type { EntitlementId, PlayerEntitlement } from './entitlements';

export type ProviderSource = PlayerEntitlement['source'];

export interface VerifiedPurchaseEvent {
  provider: ProviderSource;
  externalTransactionId: string;
  entitlementId: EntitlementId;
  occurredAt: number;
  expiresAt?: number;
  eventType: 'purchase_succeeded' | 'subscription_renewed' | 'purchase_refunded' | 'subscription_cancelled';
  verified: boolean;
}

export interface FulfillmentState {
  entitlements: PlayerEntitlement[];
  processedEventIds: string[];
}

export interface FulfillmentResult {
  changed: boolean;
  reason: 'granted' | 'renewed' | 'revoked' | 'duplicate_event' | 'unverified_event' | 'no_matching_entitlement';
  state: FulfillmentState;
}

const eventKey = (event: VerifiedPurchaseEvent): string =>
  `${event.provider}:${event.externalTransactionId}:${event.eventType}:${event.occurredAt}`;

export function processVerifiedPurchaseEvent(
  state: FulfillmentState,
  event: VerifiedPurchaseEvent
): FulfillmentResult {
  const key = eventKey(event);
  if (state.processedEventIds.includes(key)) {
    return { changed: false, reason: 'duplicate_event', state };
  }
  if (!event.verified) {
    return { changed: false, reason: 'unverified_event', state };
  }

  const processedEventIds = [...state.processedEventIds, key];
  const existingIndex = state.entitlements.findIndex(item =>
    item.entitlementId === event.entitlementId &&
    item.source === event.provider &&
    item.externalTransactionId === event.externalTransactionId
  );

  if (event.eventType === 'purchase_refunded' || event.eventType === 'subscription_cancelled') {
    if (existingIndex < 0) {
      return {
        changed: false,
        reason: 'no_matching_entitlement',
        state: { ...state, processedEventIds },
      };
    }
    const entitlements = state.entitlements.map((item, index) =>
      index === existingIndex ? { ...item, revokedAt: event.occurredAt } : item
    );
    return { changed: true, reason: 'revoked', state: { entitlements, processedEventIds } };
  }

  if (existingIndex >= 0) {
    const entitlements = state.entitlements.map((item, index) =>
      index === existingIndex
        ? { ...item, expiresAt: event.expiresAt, revokedAt: undefined }
        : item
    );
    return { changed: true, reason: 'renewed', state: { entitlements, processedEventIds } };
  }

  const entitlement: PlayerEntitlement = {
    entitlementId: event.entitlementId,
    source: event.provider,
    externalTransactionId: event.externalTransactionId,
    grantedAt: event.occurredAt,
    expiresAt: event.expiresAt,
  };
  return {
    changed: true,
    reason: 'granted',
    state: { entitlements: [...state.entitlements, entitlement], processedEventIds },
  };
}
