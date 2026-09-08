import { describe, expect, it } from 'vitest';
import { discoveryPercent, updateDiscovery } from '../src/game/fogOfWar';

describe('fog of war discovery', () => {
  it('reveals scouted nodes without downgrading cleared locations', () => {
    const current = { ashfall: 'cleared', ridge: 'hidden', crown: 'hidden' } as const;
    const next = updateDiscovery(current, { ridge: 'scouted', ashfall: 'scouted' });
    expect(next).toEqual({ ashfall: 'cleared', ridge: 'scouted', crown: 'hidden' });
    expect(discoveryPercent(next)).toBe(67);
  });

  it('upgrades scouted locations to cleared', () => {
    expect(updateDiscovery({ ridge: 'scouted' }, { ridge: 'cleared' }).ridge).toBe('cleared');
  });
});
