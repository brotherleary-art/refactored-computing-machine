import { describe, expect, it } from 'vitest';
import { planSupplyRun, roadUpgradeBenefit } from '../src/game/supplyLines';

describe('Cinder Vale supply lines', () => {
  it('caps cargo, applies danger losses, and requires enough escort power', () => {
    const plan = planSupplyRun({ id: 'ashfall-gate', distance: 18, danger: 55, roadQuality: 30 }, 200, 12);
    expect(plan.capacity).toBe(71);
    expect(plan.losses).toBeGreaterThan(0);
    expect(plan.delivered).toBeLessThanOrEqual(plan.capacity);
    expect(plan.viable).toBe(false);
  });

  it('makes stronger escorts and better roads materially safer', () => {
    const route = { id: 'blackglass-road', distance: 24, danger: 60, roadQuality: 20 };
    const weak = planSupplyRun(route, 80, 10);
    const strong = planSupplyRun(route, 80, 70);
    expect(strong.losses).toBeLessThan(weak.losses);
    expect(strong.viable).toBe(true);
    expect(roadUpgradeBenefit(route, 80, 80, 35)).toBeGreaterThanOrEqual(0);
  });
});
