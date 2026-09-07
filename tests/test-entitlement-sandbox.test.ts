import { describe, expect, it } from 'vitest';
import { createTestEntitlementState, applyVerifiedTestPurchase } from '../src/game/testEntitlementSandbox';

describe('test entitlement sandbox', () => {
  it('refuses unverified test purchase events', () => {
    const state = createTestEntitlementState();
    expect(() => applyVerifiedTestPurchase(state, { eventId: 'evt_1', entitlementId: 'founder_bronze', verified: false })).toThrow('UNVERIFIED_TEST_EVENT');
  });

  it('grants a verified entitlement exactly once', () => {
    const state = createTestEntitlementState();
    const event = { eventId: 'evt_2', entitlementId: 'founder_bronze' as const, verified: true as const };
    const once = applyVerifiedTestPurchase(state, event);
    const twice = applyVerifiedTestPurchase(once, event);
    expect(twice.entitlements).toEqual(['founder_bronze']);
    expect(twice.processedEventIds).toEqual(['evt_2']);
  });

  it('never changes combat power', () => {
    const state = createTestEntitlementState();
    const next = applyVerifiedTestPurchase(state, { eventId: 'evt_3', entitlementId: 'founder_gold', verified: true });
    expect(next.combatPowerDelta).toBe(0);
  });
});
