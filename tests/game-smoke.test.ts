import { describe, expect, it } from 'vitest';
import { createSettlementState, canUpgrade, queueUpgrade, applyTick } from '../src/game/simulation';
import { STARTING_REGION_LOCATIONS, discoverLocation } from '../src/game/world';


describe('settlement loop', () => {
  it('allows the first farm repair from the starting state', () => {
    const state = createSettlementState(1_000);
    expect(canUpgrade(state, 'farm')).toEqual({ ok: true });
  });

  it('spends resources, queues construction, and completes the building after its timer', () => {
    const startedAt = 1_000;
    const state = createSettlementState(startedAt);
    const timberBefore = state.wallet.timber;
    const queued = queueUpgrade(state, 'farm', startedAt);

    expect(queued.queue).toHaveLength(1);
    expect(queued.wallet.timber).toBeLessThan(timberBefore);

    const completed = applyTick(queued, queued.queue[0].completesAt);
    expect(completed.buildings.farm).toBe(1);
    expect(completed.queue).toHaveLength(0);
  });
});

describe('starting region', () => {
  it('contains the promised 25 authored locations and the major ruin', () => {
    expect(STARTING_REGION_LOCATIONS).toHaveLength(25);
    expect(STARTING_REGION_LOCATIONS.some(location => location.id === 'major-ruin')).toBe(true);
  });

  it('records a discovery only once', () => {
    const first = discoverLocation({ discoveredLocationIds: [] }, 'grove-1');
    const second = discoverLocation(first, 'grove-1');
    expect(second.discoveredLocationIds).toEqual(['grove-1']);
  });
});
