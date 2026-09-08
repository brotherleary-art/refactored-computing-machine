import { describe, expect, it } from 'vitest';
import { recoverTestEntitlements } from '../src/game/testCommerceRecovery.js';

describe('test commerce recovery', () => {
  it('rebuilds active entitlements from verified test events only', () => {
    const result = recoverTestEntitlements([
      { id: 'e1', playerId: 'p1', mode: 'test', verified: true, type: 'purchase', entitlement: 'founder-banner' },
      { id: 'e2', playerId: 'p1', mode: 'test', verified: true, type: 'refund', entitlement: 'founder-banner' },
      { id: 'e3', playerId: 'p1', mode: 'test', verified: true, type: 'purchase', entitlement: 'ember-cloak' },
    ], 'p1');

    expect(result.activeEntitlements).toEqual(['ember-cloak']);
    expect(result.processedEventIds).toEqual(['e1', 'e2', 'e3']);
  });

  it('rejects live-mode or unverified events', () => {
    expect(() => recoverTestEntitlements([
      { id: 'live-1', playerId: 'p1', mode: 'live', verified: true, type: 'purchase', entitlement: 'founder-banner' },
    ], 'p1')).toThrow('test-mode only');

    expect(() => recoverTestEntitlements([
      { id: 'bad-1', playerId: 'p1', mode: 'test', verified: false, type: 'purchase', entitlement: 'founder-banner' },
    ], 'p1')).toThrow('unverified event');
  });
});
