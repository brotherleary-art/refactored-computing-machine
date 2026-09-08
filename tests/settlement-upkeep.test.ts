import { describe, expect, it } from 'vitest';
import { applySettlementUpkeep } from '../src/game/settlementUpkeep';

describe('settlement upkeep', () => {
  it('consumes food based on population and elapsed hours', () => {
    const next = applySettlementUpkeep({ food: 100, population: 24, morale: 80 }, 2);
    expect(next.food).toBe(76);
    expect(next.population).toBe(24);
    expect(next.morale).toBe(80);
  });

  it('never creates negative food and applies starvation pressure when supplies run out', () => {
    const next = applySettlementUpkeep({ food: 5, population: 24, morale: 80 }, 2);
    expect(next.food).toBe(0);
    expect(next.population).toBeLessThan(24);
    expect(next.morale).toBeLessThan(80);
    expect(next.starvationHours).toBeGreaterThan(0);
  });
});
