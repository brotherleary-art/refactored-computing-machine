export type TestOfferKind = 'cosmetic' | 'supporter' | 'convenience';

export interface TestOffer {
  id: string;
  version: number;
  kind: TestOfferKind;
  entitlement: string;
  priceCents: number;
  combatPowerDelta: 0;
  active: boolean;
}

export interface TestOfferCatalog {
  environment: 'test';
  currency: 'USD';
  offers: TestOffer[];
}

export function validateTestOfferCatalog(catalog: TestOfferCatalog): void {
  if (catalog.environment !== 'test') throw new Error('Only test catalogs are allowed');
  const seen = new Set<string>();
  for (const offer of catalog.offers) {
    if (!offer.id || seen.has(offer.id)) throw new Error('Offer ids must be unique');
    seen.add(offer.id);
    if (offer.version < 1) throw new Error('Offer version must be positive');
    if (offer.priceCents < 0) throw new Error('Price cannot be negative');
    if (offer.combatPowerDelta !== 0) throw new Error('Offers cannot grant combat power');
  }
}

export function activeTestOffers(catalog: TestOfferCatalog): TestOffer[] {
  validateTestOfferCatalog(catalog);
  return catalog.offers.filter(o => o.active).map(o => ({ ...o }));
}
