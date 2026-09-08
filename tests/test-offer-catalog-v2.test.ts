import { describe, expect, it } from 'vitest';
import { activeTestOffers, validateTestOfferCatalog, type TestOfferCatalog } from '../src/game/testOfferCatalogV2.js';

const catalog: TestOfferCatalog = {
  environment: 'test', currency: 'USD', offers: [
    { id: 'founder-banner', version: 1, kind: 'supporter', entitlement: 'founder.banner', priceCents: 499, combatPowerDelta: 0, active: true },
    { id: 'ember-cloak', version: 2, kind: 'cosmetic', entitlement: 'cosmetic.ember-cloak', priceCents: 299, combatPowerDelta: 0, active: true },
  ],
};

describe('test offer catalog v2', () => {
  it('returns only valid active test offers', () => {
    expect(activeTestOffers(catalog)).toHaveLength(2);
  });

  it('rejects duplicate ids and any combat power sale', () => {
    const duplicate = { ...catalog, offers: [...catalog.offers, { ...catalog.offers[0] }] };
    expect(() => validateTestOfferCatalog(duplicate)).toThrow(/unique/);
    const powerSale = { ...catalog, offers: [{ ...catalog.offers[0], combatPowerDelta: 1 as 0 }] };
    expect(() => validateTestOfferCatalog(powerSale)).toThrow(/combat power/);
  });
});
