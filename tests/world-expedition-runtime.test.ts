import { describe, expect, it } from 'vitest';
import { advanceWorldExpedition } from '../src/game/worldExpeditionRuntime.js';

describe('world expedition runtime', () => {
  it('advances travel and spends supplies before arrival', () => {
    const result = advanceWorldExpedition({
      now: 1500,
      expedition: {
        id: 'ridge-run',
        startedAt: 1000,
        arrivesAt: 2000,
        supplies: 5,
        supplyCostPerStep: 1,
        progress: 0,
        status: 'traveling',
      },
    });

    expect(result.expedition.progress).toBe(50);
    expect(result.expedition.supplies).toBe(4);
    expect(result.expedition.status).toBe('traveling');
  });

  it('marks the expedition stranded if it cannot pay the next supply cost', () => {
    const result = advanceWorldExpedition({
      now: 1500,
      expedition: {
        id: 'hollow-crown',
        startedAt: 1000,
        arrivesAt: 2000,
        supplies: 0,
        supplyCostPerStep: 1,
        progress: 0,
        status: 'traveling',
      },
    });

    expect(result.expedition.status).toBe('stranded');
    expect(result.expedition.progress).toBe(0);
  });
});
