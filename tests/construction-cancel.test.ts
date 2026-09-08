import { describe, expect, it } from 'vitest';
import { cancelConstruction } from '../src/game/constructionCancel.js';

describe('construction cancellation', () => {
  it('refunds a partial share before work is half complete', () => {
    const result = cancelConstruction({
      now: 1200,
      wallet: { timber: 10, stone: 5 },
      order: { id: 'storehouse-1', startedAt: 1000, completesAt: 2000, cost: { timber: 100, stone: 50 } },
    });

    expect(result.cancelled).toBe(true);
    expect(result.refund).toEqual({ timber: 75, stone: 37 });
    expect(result.wallet).toEqual({ timber: 85, stone: 42 });
  });

  it('refuses cancellation after the timer has completed', () => {
    const result = cancelConstruction({
      now: 2000,
      wallet: { timber: 0, stone: 0 },
      order: { id: 'farm-2', startedAt: 1000, completesAt: 2000, cost: { timber: 40, stone: 20 } },
    });

    expect(result.cancelled).toBe(false);
    expect(result.reason).toBe('already-complete');
  });
});
