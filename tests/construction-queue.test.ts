import { describe, expect, it } from 'vitest';
import { canConstruct, completeConstruction, queueConstruction } from '../src/game/constructionQueue.js';
import { createStartingWallet } from '../src/game/resources.js';

describe('construction queue', () => {
  it('enforces prerequisite building levels', () => {
    expect(canConstruct('farm', {})).toBe(false);
    expect(canConstruct('farm', { townHall: 1 })).toBe(true);
    expect(canConstruct('forge', { barracks: 1, ironMine: 0 })).toBe(false);
  });

  it('spends resources immediately and finishes only after the timer', () => {
    const start = createStartingWallet();
    const queued = queueConstruction([], 'farm', { townHall: 1 }, start, 1_000);
    expect(queued.wallet.timber).toBe(start.timber - 20);
    expect(queued.queue).toHaveLength(1);

    const early = completeConstruction(queued.queue, { townHall: 1 }, queued.queue[0].readyAt - 1);
    expect(early.levels.farm ?? 0).toBe(0);

    const done = completeConstruction(queued.queue, { townHall: 1 }, queued.queue[0].readyAt);
    expect(done.levels.farm).toBe(1);
    expect(done.queue).toHaveLength(0);
  });

  it('prevents duplicate orders for the same building', () => {
    const first = queueConstruction([], 'farm', { townHall: 1 }, createStartingWallet(), 0);
    expect(() => queueConstruction(first.queue, 'farm', { townHall: 1 }, first.wallet, 0)).toThrow('BUILDING_ALREADY_QUEUED');
  });
});
