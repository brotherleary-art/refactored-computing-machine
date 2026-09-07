import { describe, expect, it } from 'vitest';
import { applyEconomyTick, getStorageCapacity } from '../src/game/economyLoop';

describe('settlement economy loop', () => {
  it('caps produced resources at storage capacity', () => {
    const result = applyEconomyTick({
      wallet: { food: 499, timber: 399, stone: 250, clay: 150, iron: 80 },
      buildings: { farm: 2, lumberCamp: 2, storehouse: 1 },
      lastTickAt: 0,
    }, 60_000);

    const cap = getStorageCapacity({ storehouse: 1 });
    expect(result.wallet.food).toBeLessThanOrEqual(cap.food);
    expect(result.wallet.timber).toBeLessThanOrEqual(cap.timber);
  });

  it('limits offline catch-up to four hours', () => {
    const start = {
      wallet: { food: 100, timber: 100, stone: 100, clay: 100, iron: 50 },
      buildings: { farm: 1 },
      lastTickAt: 0,
    };
    const fourHours = applyEconomyTick(start, 4 * 60 * 60 * 1000);
    const twoDays = applyEconomyTick(start, 48 * 60 * 60 * 1000);
    expect(twoDays.wallet.food).toBe(fourHours.wallet.food);
  });

  it('raises capacity when the storehouse levels up', () => {
    expect(getStorageCapacity({ storehouse: 2 }).food).toBeGreaterThan(getStorageCapacity({ storehouse: 1 }).food);
  });
});
