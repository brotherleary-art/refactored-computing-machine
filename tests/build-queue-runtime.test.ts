import { describe, expect, it } from 'vitest';
import { advanceBuildQueue, startBuild } from '../src/game/buildQueueRuntime.js';

const barracks = { id: 'barracks', durationMinutes: 5, requires: ['hall'], cost: { timber: 20, stone: 10 } };

describe('build queue runtime', () => {
  it('enforces prerequisites, spends resources, and completes on time', () => {
    const started = startBuild({ completed: ['hall'], timber: 30, stone: 15 }, barracks, 1000);
    expect(started.timber).toBe(10);
    expect(started.active?.id).toBe('barracks');
    expect(advanceBuildQueue(started, 1000 + 299_999).active?.id).toBe('barracks');
    const done = advanceBuildQueue(started, 1000 + 300_000);
    expect(done.completed).toContain('barracks');
    expect(done.active).toBeUndefined();
  });

  it('rejects a build with missing prerequisites', () => {
    expect(() => startBuild({ completed: [], timber: 30, stone: 15 }, barracks, 0)).toThrow('missing prerequisites');
  });
});
