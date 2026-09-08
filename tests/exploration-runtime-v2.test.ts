import { describe, expect, it } from 'vitest';
import { advanceExplorationRuntime } from '../src/game/explorationRuntimeV2.js';

describe('advanceExplorationRuntime', () => {
  it('moves a scouting party to arrived when travel time is complete', () => {
    const result = advanceExplorationRuntime({
      now: 5000,
      mission: { id: 'blackglass-ridge', startedAt: 1000, arrivesAt: 4000, supplies: 3, status: 'traveling' },
    });
    expect(result.mission.status).toBe('arrived');
    expect(result.visibleEvent).toContain('Blackglass Ridge');
  });
});
