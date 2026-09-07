import { describe, expect, it } from 'vitest';
import {
  completePrototypeUpgrade,
  createPrototypeSession,
  exposePrototypeRuin,
  recordScoutDiscovery,
} from '../src/game/session';

describe('prototype session state', () => {
  it('spends resources once for a settlement upgrade', () => {
    const start = createPrototypeSession();
    const upgraded = completePrototypeUpgrade(start, 'farm');
    const repeated = completePrototypeUpgrade(upgraded, 'farm');

    expect(upgraded.resources.timber).toBe(360);
    expect(upgraded.resources.stone).toBe(230);
    expect(upgraded.settlementProgress).toBe(30);
    expect(repeated).toEqual(upgraded);
  });

  it('grants scout rewards only on first discovery', () => {
    const start = createPrototypeSession();
    const first = recordScoutDiscovery(start, 'grove-1', 'Timber found', { timber: 25 });
    const repeated = recordScoutDiscovery(first, 'grove-1', 'Timber found', { timber: 25 });

    expect(first.resources.timber).toBe(425);
    expect(repeated.resources.timber).toBe(425);
    expect(repeated.discoveredLocationIds.filter((id) => id === 'grove-1')).toHaveLength(1);
  });

  it('gates the buried ruin until settlement progress is high enough', () => {
    let state = createPrototypeSession();
    expect(exposePrototypeRuin(state).ruinExposed).toBe(false);

    for (const id of ['farm', 'lumber', 'store', 'barracks']) {
      state = completePrototypeUpgrade(state, id);
    }

    const exposed = exposePrototypeRuin(state);
    expect(exposed.settlementProgress).toBeGreaterThanOrEqual(55);
    expect(exposed.ruinExposed).toBe(true);
    expect(exposed.resources.iron).toBe(95);
  });
});
