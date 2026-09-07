import { describe, expect, it } from 'vitest';
import { createStartingWallet } from '../src/game/resources.js';
import { requiredFoundation, settlementReadiness } from '../src/game/settlementReadiness.js';

describe('settlement readiness', () => {
  it('recommends the first missing foundation building', () => {
    const wallet = createStartingWallet();
    const result = settlementReadiness({ townHall: 1 }, wallet);
    expect(result.complete).toBe(false);
    expect(result.next?.buildingId).toBe('farm');
    expect(result.next?.affordable).toBe(true);
  });

  it('shows prerequisite blockers instead of pretending a build is available', () => {
    const wallet = createStartingWallet();
    const result = settlementReadiness({ townHall: 1, farm: 1, lumberCamp: 1 }, wallet);
    expect(result.next?.buildingId).toBe('quarry');
    expect(result.next?.blockedBy).toEqual([]);
  });

  it('reaches 100 percent only when the whole foundation is present', () => {
    const wallet = createStartingWallet();
    const levels = Object.fromEntries(requiredFoundation.map((id) => [id, 1]));
    const result = settlementReadiness(levels, wallet);
    expect(result).toEqual({ score: 100, complete: true, next: null });
  });
});
