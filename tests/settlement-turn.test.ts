import { describe, expect, it } from 'vitest';
import { runSettlementTurn } from '../src/game/settlementTurn.js';

describe('settlement turn', () => {
  it('consumes upkeep, produces staffed resources, and clamps storage in one turn', () => {
    const result = runSettlementTurn({
      wallet: { food: 100, timber: 40, stone: 20, clay: 10, iron: 5 },
      storageCap: { food: 110, timber: 100, stone: 100, clay: 100, iron: 100 },
      population: 20,
      morale: 1,
      minutes: 10,
      sources: [
        { id: 'farm', resource: 'food', perMinute: 2, damageModifier: 1, staffed: true },
        { id: 'lumber', resource: 'timber', perMinute: 1, damageModifier: 1, staffed: true },
      ],
    });

    expect(result.upkeep.foodConsumed).toBe(10);
    expect(result.wallet.food).toBe(110);
    expect(result.wallet.timber).toBe(50);
    expect(result.production.wasted.food).toBe(0);
    expect(result.starving).toBe(false);
  });

  it('reports starvation when upkeep exceeds available food', () => {
    const result = runSettlementTurn({
      wallet: { food: 2, timber: 0, stone: 0, clay: 0, iron: 0 },
      storageCap: { food: 100, timber: 100, stone: 100, clay: 100, iron: 100 },
      population: 20,
      morale: 1,
      minutes: 10,
      sources: [],
    });

    expect(result.wallet.food).toBe(0);
    expect(result.starving).toBe(true);
    expect(result.upkeep.shortfall).toBe(8);
  });
});
