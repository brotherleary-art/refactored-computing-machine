import { describe, expect, it } from 'vitest';
import { scheduleBuildPlan } from '../src/game/buildPlanTimeline';

describe('build plan timeline', () => {
  it('schedules sequential prerequisite-satisfying work', () => {
    const plan = scheduleBuildPlan([
      { building: 'lumberCamp', targetLevel: 1 },
      { building: 'quarry', targetLevel: 1 },
      { building: 'storehouse', targetLevel: 1 },
      { building: 'barracks', targetLevel: 1 },
    ], { townHall: 1 }, 10_000);
    expect(plan).toHaveLength(4);
    expect(plan[0].startAt).toBe(10_000);
    expect(plan[1].startAt).toBe(plan[0].finishAt);
    expect(plan[3].finishAt).toBeGreaterThan(plan[3].startAt);
  });

  it('rejects a plan whose prerequisite has not been met earlier in the plan', () => {
    expect(() => scheduleBuildPlan([{ building: 'forge', targetLevel: 1 }], { townHall: 2, barracks: 1 }, 0))
      .toThrow('MISSING_PREREQUISITE:ironMine');
  });
});
