import { describe, expect, it } from 'vitest';
import { canEquipCosmetic, restoreTestEntitlements } from '../src/game/testEntitlementGate.js';

describe('test entitlement gate', () => {
  it('restores verified test purchases and removes refunds', () => {
    const events = [
      { id: '1', playerId: 'p1', offerId: 'founder-banner', type: 'purchase' as const, verified: true, live: false },
      { id: '2', playerId: 'p1', offerId: 'ember-cloak', type: 'purchase' as const, verified: true, live: false },
      { id: '3', playerId: 'p1', offerId: 'ember-cloak', type: 'refund' as const, verified: true, live: false },
    ];
    const entitlements = restoreTestEntitlements(events, 'p1');
    expect(entitlements).toEqual(['founder-banner']);
    expect(canEquipCosmetic(entitlements, 'founder-banner')).toBe(true);
    expect(canEquipCosmetic(entitlements, 'ember-cloak')).toBe(false);
  });

  it('blocks live-mode commerce events', () => {
    expect(() => restoreTestEntitlements([
      { id: 'live-1', playerId: 'p1', offerId: 'founder-banner', type: 'purchase', verified: true, live: true },
    ], 'p1')).toThrow('live commerce is disabled');
  });
});
