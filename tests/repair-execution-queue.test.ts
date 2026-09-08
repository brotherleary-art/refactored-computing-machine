import { describe, expect, it } from 'vitest';
import { collectCompletedRepairs, queueRepair } from '../src/game/repairExecutionQueue.js';

describe('repair execution queue', () => {
  it('spends resources and completes only after the timer', () => {
    const queued = queueRepair({ timber: 100, stone: 80 }, [], { buildingId: 'farm', restore: 30, timberCost: 18, stoneCost: 12, durationSeconds: 60 }, 1000);
    expect(queued.resources).toEqual({ timber: 82, stone: 68 });
    expect(collectCompletedRepairs(queued.active, 60999).completed).toHaveLength(0);
    expect(collectCompletedRepairs(queued.active, 61000).completed).toHaveLength(1);
  });

  it('blocks duplicate repair orders and unaffordable repairs', () => {
    const first = queueRepair({ timber: 100, stone: 100 }, [], { buildingId: 'hall', restore: 20, timberCost: 10, stoneCost: 10, durationSeconds: 30 }, 0);
    expect(() => queueRepair({ timber: 100, stone: 100 }, first.active, { buildingId: 'hall', restore: 10, timberCost: 5, stoneCost: 5, durationSeconds: 20 }, 0)).toThrow(/active repair/);
    expect(() => queueRepair({ timber: 1, stone: 1 }, [], { buildingId: 'store', restore: 10, timberCost: 5, stoneCost: 5, durationSeconds: 20 }, 0)).toThrow(/Insufficient/);
  });
});
