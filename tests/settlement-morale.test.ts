import { describe, expect, it } from 'vitest';
import { evaluateSettlementMorale } from '../src/game/settlementMorale.js';

describe('settlement morale', () => {
  it('rewards food security, safe roads, and victories', () => {
    const result = evaluateSettlementMorale({
      foodHours: 14,
      damagedBuildings: 0,
      securedRoads: true,
      recentVictory: true,
      population: 24,
      shelterCapacity: 30,
    });
    expect(result.tier).toBe('resolute');
    expect(result.productionMultiplier).toBe(1.1);
    expect(result.desertionRisk).toBe(false);
  });

  it('can push a starving overcrowded settlement into breaking morale', () => {
    const result = evaluateSettlementMorale({
      foodHours: 2,
      damagedBuildings: 3,
      securedRoads: false,
      recentVictory: false,
      population: 30,
      shelterCapacity: 20,
    });
    expect(result.score).toBeLessThan(25);
    expect(result.tier).toBe('breaking');
    expect(result.productionMultiplier).toBe(0.7);
  });
});
