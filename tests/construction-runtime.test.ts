import { describe, expect, it } from 'vitest';
import { advanceConstructionRuntime } from '../src/game/constructionRuntime.js';

describe('advanceConstructionRuntime', () => {
  it('completes ready orders and leaves later orders queued', () => {
    const result = advanceConstructionRuntime({
      now: 1000,
      levels: { farm: 1 },
      queue: [
        { buildingId: 'farm', targetLevel: 2, readyAt: 900 },
        { buildingId: 'lumberCamp', targetLevel: 1, readyAt: 1200 },
      ],
    });
    expect(result.levels.farm).toBe(2);
    expect(result.queue).toHaveLength(1);
    expect(result.completed).toEqual(['farm']);
  });
});
