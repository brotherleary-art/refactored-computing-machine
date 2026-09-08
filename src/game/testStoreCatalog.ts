import { applyTestEntitlementReceipt, type TestEntitlementReceipt } from './testEntitlementReceipt';

export type StoreBenefit = 'cosmetic' | 'founder-badge' | 'queue-slot' | 'season-access';

export interface TestStoreSku {
  sku: string;
  name: string;
  benefit: StoreBenefit;
  combatPower: boolean;
}

export interface TestStoreState {
  receipts: TestEntitlementReceipt[];
  unlockedSkus: string[];
}

export const TEST_STORE_CATALOG: TestStoreSku[] = [
  { sku: 'founder_ember', name: 'Ember Founder Pack', benefit: 'founder-badge', combatPower: false },
  { sku: 'cosmetic_banner_ashfall', name: 'Ashfall Banner', benefit: 'cosmetic', combatPower: false },
  { sku: 'season_zero', name: 'Season Zero Access', benefit: 'season-access', combatPower: false },
  { sku: 'builder_queue_slot', name: 'Builder Queue Slot', benefit: 'queue-slot', combatPower: false },
];

export function grantTestStorePurchase(
  state: TestStoreState,
  receipt: TestEntitlementReceipt,
): TestStoreState {
  const product = TEST_STORE_CATALOG.find((entry) => entry.sku === receipt.sku);
  if (!product) throw new Error('unknown test store sku');
  if (product.combatPower) throw new Error('combat-power products are forbidden');

  const receipts = applyTestEntitlementReceipt(state.receipts, receipt);
  const unlockedSkus = state.unlockedSkus.includes(receipt.sku)
    ? [...state.unlockedSkus]
    : [...state.unlockedSkus, receipt.sku];

  return { receipts, unlockedSkus };
}
