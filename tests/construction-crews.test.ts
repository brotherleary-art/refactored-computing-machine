import { describe, expect, it } from 'vitest';
import { assignConstructionCrew } from '../src/game/constructionCrews';

describe('construction crews', () => {
  it('reduces build time when more workers are assigned within the crew cap', () => {
    const small = assignConstructionCrew({ baseSeconds: 600, minWorkers: 2, maxWorkers: 8 }, 2);
    const large = assignConstructionCrew({ baseSeconds: 600, minWorkers: 2, maxWorkers: 8 }, 6);
    expect(large.durationSeconds).toBeLessThan(small.durationSeconds);
    expect(large.assignedWorkers).toBe(6);
  });

  it('rejects assignments below the minimum and clamps assignments above the cap', () => {
    expect(() => assignConstructionCrew({ baseSeconds: 600, minWorkers: 2, maxWorkers: 8 }, 1)).toThrow();
    const capped = assignConstructionCrew({ baseSeconds: 600, minWorkers: 2, maxWorkers: 8 }, 20);
    expect(capped.assignedWorkers).toBe(8);
  });
});
