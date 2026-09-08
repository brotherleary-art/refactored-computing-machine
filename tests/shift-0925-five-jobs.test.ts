import { describe, expect, it } from 'vitest';
import { assignSettlementWorkers } from '../src/game/settlementWorkAssignments';
import { planDependencyQueue } from '../src/game/buildQueueDependencies';
import { respawnWorldThreat } from '../src/game/worldThreatRespawn';
import { recoverCampaignForces } from '../src/game/campaignRecoveryLoop';
import { applyTestEntitlementReceipt } from '../src/game/testEntitlementReceipt';

describe('job 1: settlement worker assignment', () => {
  it('allocates workers without exceeding population and exposes production staffing', () => {
    const result = assignSettlementWorkers(12, [
      { id: 'farm', resource: 'food', requested: 7 },
      { id: 'lumber', resource: 'timber', requested: 7 },
    ]);
    expect(result.assigned).toEqual({ farm: 7, lumber: 5 });
    expect(result.unassigned).toBe(0);
  });
});

describe('job 2: dependency-aware building queue', () => {
  it('orders prerequisites before dependent construction and gives stable ETAs', () => {
    const plan = planDependencyQueue([
      { id: 'barracks', minutes: 12, requires: ['storehouse'] },
      { id: 'storehouse', minutes: 8, requires: [] },
    ], []);
    expect(plan.map(step => step.id)).toEqual(['storehouse', 'barracks']);
    expect(plan.at(-1)?.completesAtMinute).toBe(20);
  });
});

describe('job 3: repeatable world threat', () => {
  it('respawns a cleared camp only after cooldown with stronger forces', () => {
    expect(() => respawnWorldThreat({ clearedAt: 100, enemyForces: 20, clears: 1 }, 120, 30)).toThrow();
    const next = respawnWorldThreat({ clearedAt: 100, enemyForces: 20, clears: 1 }, 130, 30);
    expect(next.enemyForces).toBeGreaterThan(20);
    expect(next.clears).toBe(1);
    expect(next.active).toBe(true);
  });
});

describe('job 4: campaign force recovery persistence', () => {
  it('recovers survivors over elapsed time but never above force cap', () => {
    const recovered = recoverCampaignForces({ survivors: 18, forceCap: 30, wounded: 9 }, 20);
    expect(recovered.survivors).toBeGreaterThan(18);
    expect(recovered.survivors).toBeLessThanOrEqual(30);
    expect(recovered.wounded).toBeLessThan(9);
  });
});

describe('job 5: test entitlement receipt', () => {
  it('is test-only and idempotent by receipt id', () => {
    const first = applyTestEntitlementReceipt([], { id: 'r-1', sku: 'founder-scout', mode: 'test', grantedAt: 10 });
    const second = applyTestEntitlementReceipt(first, { id: 'r-1', sku: 'founder-scout', mode: 'test', grantedAt: 10 });
    expect(second).toHaveLength(1);
    expect(() => applyTestEntitlementReceipt(second, { id: 'live-1', sku: 'x', mode: 'live' as never, grantedAt: 11 })).toThrow();
  });
});
