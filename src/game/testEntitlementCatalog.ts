export type TestCatalogItem = {
  sku: string;
  kind: 'cosmetic' | 'founder-pack';
  displayName: string;
  testPriceUsd: number;
};

export type TestEntitlementState = {
  mode: 'test';
  ownedSkus: string[];
  processedEventIds: string[];
};

export const TEST_CATALOG: TestCatalogItem[] = [
  { sku: 'founder_ember', kind: 'founder-pack', displayName: 'Ember Founder Pack', testPriceUsd: 9.99 },
  { sku: 'banner_ashfall', kind: 'cosmetic', displayName: 'Ashfall Banner', testPriceUsd: 2.99 },
];

export function applyTestEntitlementEvent(
  state: TestEntitlementState,
  event: { id: string; type: 'purchase' | 'refund'; sku: string; mode: 'test' | 'live' },
): TestEntitlementState {
  if (event.mode !== 'test') throw new Error('live commerce events are disabled in this runtime');
  if (!TEST_CATALOG.some((item) => item.sku === event.sku)) throw new Error('unknown catalog sku');
  if (state.processedEventIds.includes(event.id)) return state;

  const owned = new Set(state.ownedSkus);
  if (event.type === 'purchase') owned.add(event.sku);
  else owned.delete(event.sku);

  return {
    mode: 'test',
    ownedSkus: [...owned].sort(),
    processedEventIds: [...state.processedEventIds, event.id],
  };
}
