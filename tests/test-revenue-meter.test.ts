import { describe, expect, it } from 'vitest';
import { summarizeTestRevenue } from '../src/game/testRevenueMeter';

describe('test revenue meter', () => {
  it('deduplicates purchase events and reports payer economics', () => {
    const event = { id: 'evt-1', playerId: 'p1', sku: 'founder-i', cents: 999, mode: 'test' as const };
    const summary = summarizeTestRevenue([
      event,
      event,
      { id: 'evt-2', playerId: 'p2', sku: 'founder-ii', cents: 2499, mode: 'test' as const },
    ]);
    expect(summary).toEqual({ grossCents: 3498, uniquePayers: 2, purchases: 2, averageRevenuePerPayerCents: 1749 });
  });

  it('does not count free entitlements as paying users', () => {
    const summary = summarizeTestRevenue([{ id: 'evt-free', playerId: 'p1', sku: 'qa-access', cents: 0, mode: 'test' }]);
    expect(summary.uniquePayers).toBe(0);
    expect(summary.averageRevenuePerPayerCents).toBe(0);
  });
});
