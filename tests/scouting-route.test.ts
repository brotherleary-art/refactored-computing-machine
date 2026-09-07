import { describe, expect, it } from 'vitest';
import { planScoutRoute } from '../src/game/scoutingRoute.js';

describe('scouting route planner', () => {
  it('respects time, danger, and discovered-site limits', () => {
    const route = planScoutRoute([
      { id: 'ridge', travelMinutes: 10, danger: 2, rewardScore: 20 },
      { id: 'ruin', travelMinutes: 15, danger: 3, rewardScore: 45 },
      { id: 'camp', travelMinutes: 8, danger: 5, rewardScore: 40 },
      { id: 'old', travelMinutes: 5, danger: 1, rewardScore: 99, discovered: true },
    ], 25, 5);
    expect(route.stops.map(s => s.id)).toEqual(['ruin', 'ridge']);
    expect(route.totalMinutes).toBe(25);
    expect(route.danger).toBe(5);
    expect(route.rewardScore).toBe(65);
  });
});
