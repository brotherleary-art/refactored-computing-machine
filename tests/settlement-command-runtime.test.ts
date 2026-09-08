import { describe, expect, it } from 'vitest';
import { runSettlementCommand } from '../src/game/settlementCommandRuntime.js';

describe('runSettlementCommand', () => {
  it('advances resources and pays food upkeep', () => {
    const result = runSettlementCommand(
      { resources: { food: 20, timber: 5, stone: 3 }, population: 10, morale: 1, elapsedMinutes: 0 },
      { minutes: 10, foodPerMinute: 1, timberPerMinute: 2, stonePerMinute: 0.5 },
    );
    expect(result.resources.food).toBe(25);
    expect(result.resources.timber).toBe(25);
    expect(result.resources.stone).toBe(8);
    expect(result.elapsedMinutes).toBe(10);
    expect(result.starving).toBe(false);
  });

  it('marks starvation and lowers morale when upkeep cannot be paid', () => {
    const result = runSettlementCommand(
      { resources: { food: 0, timber: 0, stone: 0 }, population: 20, morale: 1, elapsedMinutes: 0 },
      { minutes: 10, foodPerMinute: 0, timberPerMinute: 0, stonePerMinute: 0 },
    );
    expect(result.starving).toBe(true);
    expect(result.resources.food).toBe(0);
    expect(result.morale).toBe(0.9);
  });
});
