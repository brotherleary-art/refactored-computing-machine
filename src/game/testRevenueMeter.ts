export type TestPurchaseEvent = {
  id: string;
  playerId: string;
  sku: string;
  cents: number;
  mode: 'test';
};

export type TestRevenueSummary = {
  grossCents: number;
  uniquePayers: number;
  purchases: number;
  averageRevenuePerPayerCents: number;
};

export function summarizeTestRevenue(events: TestPurchaseEvent[]): TestRevenueSummary {
  const seen = new Set<string>();
  const uniqueEvents: TestPurchaseEvent[] = [];
  for (const event of events) {
    if (event.mode !== 'test') throw new Error('live commerce events are not accepted');
    if (!Number.isInteger(event.cents) || event.cents < 0) throw new Error('purchase cents must be a non-negative integer');
    if (seen.has(event.id)) continue;
    seen.add(event.id);
    uniqueEvents.push(event);
  }
  const grossCents = uniqueEvents.reduce((sum, event) => sum + event.cents, 0);
  const payers = new Set(uniqueEvents.filter((event) => event.cents > 0).map((event) => event.playerId));
  return {
    grossCents,
    uniquePayers: payers.size,
    purchases: uniqueEvents.length,
    averageRevenuePerPayerCents: payers.size === 0 ? 0 : Math.round(grossCents / payers.size),
  };
}
