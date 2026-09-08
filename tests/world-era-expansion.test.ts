import { describe, expect, it } from 'vitest';
import { advanceEra, unlockEligibleRegions } from '../src/game/worldEraExpansion';

const gates = [
  { id: 'cinder-vale', era: 1, explorationRequired: 10, ruinsRequired: 1 },
  { id: 'blackglass-ridge', era: 1, explorationRequired: 25, ruinsRequired: 2 },
  { id: 'salt-marches', era: 2, explorationRequired: 40, ruinsRequired: 3 },
];

describe('world era expansion', () => {
  it('unlocks only regions earned by current exploration and ruin progress', () => {
    const next = unlockEligibleRegions({ era: 1, explorationPoints: 30, ruinsCleared: 2, unlockedRegions: ['ashfall'] }, gates);
    expect(next.unlockedRegions).toEqual(['ashfall', 'cinder-vale', 'blackglass-ridge']);
  });

  it('keeps future-era lands locked even when thresholds are otherwise met', () => {
    const next = unlockEligibleRegions({ era: 1, explorationPoints: 100, ruinsCleared: 10, unlockedRegions: [] }, gates);
    expect(next.unlockedRegions).not.toContain('salt-marches');
  });

  it('advances the era only after required lands are unlocked', () => {
    expect(() => advanceEra({ era: 1, explorationPoints: 30, ruinsCleared: 2, unlockedRegions: ['cinder-vale'] }, ['cinder-vale', 'blackglass-ridge'])).toThrow(/cannot advance era/);
    expect(advanceEra({ era: 1, explorationPoints: 30, ruinsCleared: 2, unlockedRegions: ['cinder-vale', 'blackglass-ridge'] }, ['cinder-vale', 'blackglass-ridge']).era).toBe(2);
  });
});
