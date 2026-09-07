import { describe, expect, it } from 'vitest';
import { processVerifiedPurchaseEvent, type FulfillmentState, type VerifiedPurchaseEvent } from '../src/game/purchaseFulfillment';

const emptyState = (): FulfillmentState => ({ entitlements: [], processedEventIds: [] });
const event = (overrides: Partial<VerifiedPurchaseEvent> = {}): VerifiedPurchaseEvent => ({
  provider: 'stripe',
  externalTransactionId: 'txn_test_001',
  entitlementId: 'founder_bronze',
  occurredAt: 1_000,
  eventType: 'purchase_succeeded',
  verified: true,
  ...overrides,
});

describe('purchase fulfillment', () => {
  it('rejects unverified client-side style events', () => {
    const result = processVerifiedPurchaseEvent(emptyState(), event({ verified: false }));
    expect(result.changed).toBe(false);
    expect(result.reason).toBe('unverified_event');
    expect(result.state.entitlements).toHaveLength(0);
  });

  it('grants a verified entitlement exactly once', () => {
    const first = processVerifiedPurchaseEvent(emptyState(), event());
    expect(first.reason).toBe('granted');
    expect(first.state.entitlements).toHaveLength(1);
    const second = processVerifiedPurchaseEvent(first.state, event());
    expect(second.reason).toBe('duplicate_event');
    expect(second.state.entitlements).toHaveLength(1);
  });

  it('renews and then revokes the matching subscription entitlement', () => {
    const purchase = event({ entitlementId: 'explorers_guild_monthly', expiresAt: 2_000 });
    const granted = processVerifiedPurchaseEvent(emptyState(), purchase);
    const renewed = processVerifiedPurchaseEvent(granted.state, event({
      entitlementId: 'explorers_guild_monthly',
      externalTransactionId: 'txn_test_001',
      occurredAt: 1_500,
      expiresAt: 3_000,
      eventType: 'subscription_renewed',
    }));
    expect(renewed.reason).toBe('renewed');
    expect(renewed.state.entitlements[0]?.expiresAt).toBe(3_000);

    const revoked = processVerifiedPurchaseEvent(renewed.state, event({
      entitlementId: 'explorers_guild_monthly',
      externalTransactionId: 'txn_test_001',
      occurredAt: 2_500,
      eventType: 'subscription_cancelled',
    }));
    expect(revoked.reason).toBe('revoked');
    expect(revoked.state.entitlements[0]?.revokedAt).toBe(2_500);
  });
});
