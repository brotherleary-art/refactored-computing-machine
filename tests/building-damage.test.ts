import { describe, expect, it } from 'vitest';
import { createRepairOrder, damageState, finishRepair, productionModifier } from '../src/game/buildingDamage';

describe('building damage and repairs', () => {
  it('degrades production as integrity falls', () => {
    expect(damageState({ id: 'farm', maxIntegrity: 100, integrity: 80 })).toBe('operational');
    expect(productionModifier({ id: 'farm', maxIntegrity: 100, integrity: 50 })).toBe(0.7);
    expect(productionModifier({ id: 'farm', maxIntegrity: 100, integrity: 20 })).toBe(0.35);
    expect(productionModifier({ id: 'farm', maxIntegrity: 100, integrity: 0 })).toBe(0);
  });

  it('creates a timed material repair and restores integrity', () => {
    const building = { id: 'barracks', maxIntegrity: 100, integrity: 40 };
    const order = createRepairOrder(building);
    expect(order).not.toBeNull();
    expect(order!.timberCost).toBe(36);
    expect(order!.stoneCost).toBe(24);
    expect(order!.durationSeconds).toBe(180);
    expect(finishRepair(building, order!).integrity).toBe(100);
  });
});
