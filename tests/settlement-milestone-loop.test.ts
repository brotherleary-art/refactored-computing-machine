import { describe, expect, it } from 'vitest';
import { advanceSettlementLoop } from '../src/game/settlementMilestoneLoop';

describe('advanceSettlementLoop', () => {
  it('produces resources, pays upkeep, and respects storage', () => {
    const next = advanceSettlementLoop(
      { minute: 0, population: 10, morale: 80, storageCap: 100, resources: { food: 50, timber: 95, stone: 10 } },
      { foodPerMinute: 3, timberPerMinute: 2, stonePerMinute: 1, foodUpkeepPerPersonPerMinute: 0.1 },
      5,
    );
    expect(next.minute).toBe(5);
    expect(next.resources).toEqual({ food: 60, timber: 100, stone: 15 });
    expect(next.morale).toBe(80);
  });

  it('turns food deficit into morale loss without negative inventory', () => {
    const next = advanceSettlementLoop(
      { minute: 0, population: 20, morale: 50, storageCap: 100, resources: { food: 2, timber: 0, stone: 0 } },
      { foodPerMinute: 0, timberPerMinute: 0, stonePerMinute: 0, foodUpkeepPerPersonPerMinute: 0.2 },
      5,
    );
    expect(next.resources.food).toBe(0);
    expect(next.morale).toBe(48);
  });
});
