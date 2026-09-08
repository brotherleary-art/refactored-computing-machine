import { describe, expect, it } from 'vitest';
import { recoverTestEntitlementSession } from '../src/game/testEntitlementSession.js';

describe('recoverTestEntitlementSession', () => {
  it('restores verified test cosmetics and rejects live events', () => {
    const restored = recoverTestEntitlementSession([
      { id: 'evt-1', mode: 'test', verified: true, type: 'purchase', sku: 'founder-banner' },
      { id: 'evt-2', mode: 'test', verified: true, type: 'purchase', sku: 'ember-cloak' },
    ]);
    expect(restored.activeSkus).toEqual(['ember-cloak', 'founder-banner']);
    expect(() => recoverTestEntitlementSession([{ id: 'evt-live', mode: 'live', verified: true, type: 'purchase', sku: 'founder-banner' }])).toThrow('LIVE_MODE_DISABLED');
  });
});
