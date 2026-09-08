import { describe, expect, it } from 'vitest';
import { planOverlandTravel } from '../src/game/overlandTravel.js';

describe('overland travel', () => {
  it('makes secured roads faster and safer', () => {
    const unsafe = planOverlandTravel({ distance: 10, terrain: 'road', roadSecured: false, escortPower: 20, threatPower: 18, carriedSupplies: 10 });
    const safe = planOverlandTravel({ distance: 10, terrain: 'road', roadSecured: true, escortPower: 20, threatPower: 18, carriedSupplies: 10 });
    expect(safe.travelMinutes).toBeLessThan(unsafe.travelMinutes);
    expect(safe.ambushRisk).toBeLessThan(unsafe.ambushRisk);
  });

  it('blocks departure without enough rations', () => {
    const result = planOverlandTravel({ distance: 18, terrain: 'ridge', roadSecured: false, escortPower: 22, threatPower: 12, carriedSupplies: 1 });
    expect(result.canDepart).toBe(false);
    expect(result.blockers).toContain('insufficient-rations');
  });
});
