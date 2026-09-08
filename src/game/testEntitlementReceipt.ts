export type TestEntitlementReceipt = {
  id: string;
  sku: string;
  mode: 'test';
  grantedAt: number;
};

export function applyTestEntitlementReceipt(
  receipts: TestEntitlementReceipt[],
  receipt: TestEntitlementReceipt,
): TestEntitlementReceipt[] {
  if ((receipt as { mode?: string }).mode !== 'test') throw new Error('live entitlement receipts are not accepted');
  if (!receipt.id || !receipt.sku) throw new Error('receipt id and sku are required');
  if (!Number.isFinite(receipt.grantedAt) || receipt.grantedAt < 0) throw new Error('grantedAt must be non-negative');
  const existing = receipts.find(entry => entry.id === receipt.id);
  if (existing) {
    if (existing.sku !== receipt.sku) throw new Error('receipt id already belongs to another sku');
    return receipts;
  }
  return [...receipts, { ...receipt }];
}
