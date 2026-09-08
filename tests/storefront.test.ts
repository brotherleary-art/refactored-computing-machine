import { describe, expect, it } from 'vitest';
import { STORE_OFFERS, formatOfferPrice, isRevenueReadyForTest } from '../src/game/storefront';

describe('storefront configuration', () => {
  it('contains five configured launch offers', () => {
    expect(STORE_OFFERS).toHaveLength(5);
    expect(STORE_OFFERS.map(o => o.entitlementId)).toContain('founder_gold');
    expect(STORE_OFFERS.map(o => o.entitlementId)).toContain('explorers_guild_monthly');
  });

  it('keeps every offer in test mode without combat-power grants', () => {
    expect(isRevenueReadyForTest()).toBe(true);
    expect(STORE_OFFERS.every(o => o.combatPowerIncluded === false)).toBe(true);
  });

  it('formats displayed prices', () => {
    expect(formatOfferPrice(STORE_OFFERS[0])).toBe('$9.99');
    expect(formatOfferPrice(STORE_OFFERS[4])).toBe('$6.99/month');
  });
});
