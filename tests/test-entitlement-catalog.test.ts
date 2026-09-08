import { describe, expect, it } from 'vitest';
import { applyTestEntitlementEvent } from '../src/game/testEntitlementCatalog';

describe('test entitlement catalog', () => {
  it('grants, deduplicates, and refunds test entitlements', () => {
    const empty = { mode: 'test' as const, ownedSkus: [], processedEventIds: [] };
    const purchased = applyTestEntitlementEvent(empty, { id: 'e1', type: 'purchase', sku: 'founder_ember', mode: 'test' });
    expect(purchased.ownedSkus).toEqual(['founder_ember']);
    expect(applyTestEntitlementEvent(purchased, { id: 'e1', type: 'purchase', sku: 'founder_ember', mode: 'test' })).toEqual(purchased);
    const refunded = applyTestEntitlementEvent(purchased, { id: 'e2', type: 'refund', sku: 'founder_ember', mode: 'test' });
    expect(refunded.ownedSkus).toEqual([]);
  });

  it('hard-blocks live commerce events', () => {
    const empty = { mode: 'test' as const, ownedSkus: [], processedEventIds: [] };
    expect(() => applyTestEntitlementEvent(empty, { id: 'e-live', type: 'purchase', sku: 'banner_ashfall', mode: 'live' })).toThrow(/live commerce events are disabled/);
  });
});
