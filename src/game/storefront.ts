import type { EntitlementId } from './entitlements';

export interface StoreOffer {
  id: string;
  entitlementId: EntitlementId;
  label: string;
  priceUsdCents: number;
  recurring: boolean;
  status: 'test_only';
  combatPowerIncluded: false;
}

export const STORE_OFFERS: StoreOffer[] = [
  { id: 'founder-bronze', entitlementId: 'founder_bronze', label: 'Founder Bronze', priceUsdCents: 999, recurring: false, status: 'test_only', combatPowerIncluded: false },
  { id: 'founder-silver', entitlementId: 'founder_silver', label: 'Founder Silver', priceUsdCents: 2499, recurring: false, status: 'test_only', combatPowerIncluded: false },
  { id: 'founder-gold', entitlementId: 'founder_gold', label: 'Founder Gold', priceUsdCents: 4999, recurring: false, status: 'test_only', combatPowerIncluded: false },
  { id: 'season-zero', entitlementId: 'season_zero_premium', label: 'Season Zero Premium', priceUsdCents: 999, recurring: false, status: 'test_only', combatPowerIncluded: false },
  { id: 'explorers-guild', entitlementId: 'explorers_guild_monthly', label: "Explorer's Guild", priceUsdCents: 699, recurring: true, status: 'test_only', combatPowerIncluded: false },
];

export function formatOfferPrice(offer: StoreOffer): string {
  const dollars = (offer.priceUsdCents / 100).toFixed(2);
  return offer.recurring ? `$${dollars}/month` : `$${dollars}`;
}

export function isRevenueReadyForTest(offers = STORE_OFFERS): boolean {
  return offers.length > 0 && offers.every(offer => offer.status === 'test_only' && offer.priceUsdCents > 0 && offer.combatPowerIncluded === false);
}
