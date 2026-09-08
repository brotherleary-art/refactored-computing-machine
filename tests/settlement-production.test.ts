import { describe, expect, it } from 'vitest';
import { applyProductionTick } from '../src/game/settlementProduction.js';

const wallet = { food: 90, timber: 10, stone: 0, clay: 0, iron: 0 };
const cap = { food: 100, timber: 100, stone: 100, clay: 100, iron: 100 };

describe('settlement production', () => {
  it('applies staffing, damage, morale and storage caps in one tick', () => {
    const result = applyProductionTick(wallet, cap, [
      { id: 'farm', resource: 'food', perMinute: 4, damageModifier: 1, staffed: true },
      { id: 'lumber', resource: 'timber', perMinute: 5, damageModifier: 0.5, staffed: true },
      { id: 'quarry', resource: 'stone', perMinute: 5, damageModifier: 1, staffed: false },
    ], 5, 0.8);

    expect(result.wallet.food).toBe(100);
    expect(result.gained.food).toBe(10);
    expect(result.wasted.food).toBe(6);
    expect(result.wallet.timber).toBe(20);
    expect(result.wallet.stone).toBe(0);
  });

  it('rejects negative time', () => {
    expect(() => applyProductionTick(wallet, cap, [], -1)).toThrow(/negative/);
  });
});
