import { describe, expect, it } from 'vitest';
import { resolveRuinRisk } from '../src/game/ruinRiskResolution';

describe('ruin risk resolution', () => {
  it('rewards cautious preparation with safer progress', () => {
    const result = resolveRuinRisk({ danger: 55, heroPower: 48, supplies: 5, approach: 'cautious', roll: 0.4 });
    expect(result.success).toBe(true);
    expect(result.progress).toBe(22);
    expect(result.suppliesSpent).toBe(3);
    expect(result.injurySeverity).toBe('none');
  });

  it('can injure an underpowered reckless expedition', () => {
    const result = resolveRuinRisk({ danger: 90, heroPower: 40, supplies: 2, approach: 'reckless', roll: 0.9 });
    expect(result.success).toBe(false);
    expect(result.injurySeverity).toBe('serious');
    expect(result.relicChance).toBe(0);
  });

  it('rejects expeditions without the required supplies', () => {
    expect(() => resolveRuinRisk({ danger: 30, heroPower: 60, supplies: 0, approach: 'balanced', roll: 0.1 }))
      .toThrow('INSUFFICIENT_SUPPLIES');
  });
});
