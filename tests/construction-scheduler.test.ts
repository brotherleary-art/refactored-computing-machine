import { describe, expect, it } from 'vitest';
import { advanceConstruction, canScheduleBuilding, scheduleBuilding } from '../src/game/constructionScheduler';

describe('construction scheduler', () => {
  it('enforces prerequisites and completes timed builds', () => {
    const base = { minute: 0, buildings: { townHall: 1 }, queue: [], queueSlots: 1 };
    const farm = { id: 'farm', buildMinutes: 10, requires: { townHall: 1 } };
    expect(canScheduleBuilding(base, farm)).toBe(true);
    const scheduled = scheduleBuilding(base, farm);
    expect(scheduled.queue[0].finishesAtMinute).toBe(10);
    expect(advanceConstruction(scheduled, 9).buildings.farm).toBeUndefined();
    expect(advanceConstruction(scheduled, 10).buildings.farm).toBe(1);
  });

  it('rejects a missing prerequisite', () => {
    const base = { minute: 0, buildings: {}, queue: [], queueSlots: 1 };
    const forge = { id: 'forge', buildMinutes: 30, requires: { quarry: 1 } };
    expect(canScheduleBuilding(base, forge)).toBe(false);
    expect(() => scheduleBuilding(base, forge)).toThrow();
  });
});
