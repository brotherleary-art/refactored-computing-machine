import { describe, expect, it } from 'vitest';
import { scheduleConstructionOrders } from '../src/game/constructionSchedule';

describe('construction schedule', () => {
  it('sequences queued builds across the available crews', () => {
    const scheduled = scheduleConstructionOrders([
      { id: 'farm', durationSeconds: 60 },
      { id: 'lumber', durationSeconds: 120 },
      { id: 'storehouse', durationSeconds: 30 },
    ], 2, 1_000);

    expect(scheduled[0]).toMatchObject({ id: 'farm', crew: 1, startsAt: 1_000, completesAt: 61_000 });
    expect(scheduled[1]).toMatchObject({ id: 'lumber', crew: 2, startsAt: 1_000, completesAt: 121_000 });
    expect(scheduled[2]).toMatchObject({ id: 'storehouse', crew: 1, startsAt: 61_000, completesAt: 91_000 });
  });

  it('rejects schedules without a construction crew', () => {
    expect(() => scheduleConstructionOrders([{ id: 'farm', durationSeconds: 60 }], 0, 0)).toThrow('NO_CONSTRUCTION_CREWS');
  });
});
