import { describe, expect, it } from 'vitest';
import { advanceSettlementLoop } from '../src/game/playableSettlementLoop.js';

describe('advanceSettlementLoop', () => {
  it('consumes upkeep before production and reports the new wallet', () => {
    const result = advanceSettlementLoop({
      wallet: { food: 100, timber: 0, stone: 0, clay: 0, iron: 0 },
      storageCap: { food: 200, timber: 200, stone: 200, clay: 200, iron: 200 },
      population: 10,
      morale: 1,
      minutes: 10,
      sources: [{ resource: 'food', perMinute: 2, staffing: 1, condition: 1 }],
    });
    expect(result.upkeep.foodConsumed).toBe(5);
    expect(result.wallet.food).toBe(115);
    expect(result.summary).toContain('Food');
  });
});
