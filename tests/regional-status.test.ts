import { describe, expect, it } from 'vitest';
import { calculateRegionalStatus } from '../src/game/regionalStatus';

const unresolved = { resolved: false, victory: false, playerForces: 0 };

describe('regional safety status', () => {
  it('starts fractured before threats are cleared', () => {
    const status = calculateRegionalStatus({ guardian: unresolved, brokenPike: unresolved, greyBanner: unresolved });
    expect(status.tier).toBe('fractured');
    expect(status.clearedThreats).toBe(0);
    expect(status.roadsSecured).toBe(false);
  });

  it('becomes contested after meaningful victories', () => {
    const status = calculateRegionalStatus({
      guardian: { resolved: true, victory: true, playerForces: 37 },
      brokenPike: { resolved: true, victory: true, playerForces: 31 },
      greyBanner: unresolved,
    });
    expect(status.tier).toBe('contested');
    expect(status.clearedThreats).toBe(2);
  });

  it('secures roads only after both field threats are defeated', () => {
    const status = calculateRegionalStatus({
      guardian: { resolved: true, victory: true, playerForces: 37 },
      brokenPike: { resolved: true, victory: true, playerForces: 31 },
      greyBanner: { resolved: true, victory: true, playerForces: 29 },
    });
    expect(status.tier).toBe('secured');
    expect(status.roadsSecured).toBe(true);
    expect(status.safetyScore).toBeGreaterThanOrEqual(72);
  });
});
