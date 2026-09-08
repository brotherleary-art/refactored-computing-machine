import { describe, expect, it } from 'vitest';
import { availableResources, releaseReservation, reserveResources } from '../src/game/resourceReservation';
import type { ResourceWallet } from '../src/game/resources';

const wallet: ResourceWallet = { food: 100, timber: 80, stone: 60, clay: 40, iron: 20, population: 24 };

describe('resource reservations', () => {
  it('prevents two queued actions from promising the same resources', () => {
    const first = reserveResources(wallet, [], { id: 'barracks', cost: { timber: 60, stone: 40 } });
    expect(() => reserveResources(wallet, first, { id: 'storehouse', cost: { timber: 30, stone: 20 } })).toThrow('INSUFFICIENT_AVAILABLE_RESOURCES');
    expect(availableResources(wallet, first).timber).toBe(20);
  });

  it('releases reserved resources when an order is cancelled', () => {
    const reserved = reserveResources(wallet, [], { id: 'barracks', cost: { timber: 60 } });
    expect(availableResources(wallet, releaseReservation(reserved, 'barracks')).timber).toBe(80);
  });
});
