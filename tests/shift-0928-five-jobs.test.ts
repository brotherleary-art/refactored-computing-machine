import { describe, expect, it } from 'vitest';
import { runSettlementTurn } from '../src/game/settlementTurnRuntime';
import { advanceAndStartNextBuild } from '../src/game/constructionAutoQueue';
import { createExplorationLedger, recordExpedition } from '../src/game/explorationLedger';
import { createRecoveredCampaignSnapshot, restoreCampaignSnapshot } from '../src/game/campaignTurnSnapshot';
import { grantTestStorePurchase, TEST_STORE_CATALOG } from '../src/game/testStoreCatalog';

describe('five-job build shift', () => {
  it('connects scarce workers to real settlement production', () => {
    const result = runSettlementTurn({
      wallet: { food: 0, timber: 0, stone: 0, clay: 0, iron: 0 },
      storageCap: { food: 100, timber: 100, stone: 100, clay: 100, iron: 100 },
      availablePopulation: 2,
      assignments: [
        { id: 'farm-a', resource: 'food', requested: 1 },
        { id: 'lumber-a', resource: 'timber', requested: 2 },
      ],
      sources: [
        { id: 'farm-a', resource: 'food', perMinute: 2, damageModifier: 1, staffed: false },
        { id: 'lumber-a', resource: 'timber', perMinute: 3, damageModifier: 1, staffed: false },
      ],
      minutes: 10,
    });

    expect(result.assignedWorkers).toEqual({ 'farm-a': 1, 'lumber-a': 1 });
    expect(result.wallet.food).toBe(20);
    expect(result.wallet.timber).toBe(30);
    expect(result.unassignedPopulation).toBe(0);
  });

  it('advances a completed build and starts the next prerequisite-safe job', () => {
    const definitions = [
      { id: 'farm', durationMinutes: 5, requires: [], cost: { timber: 10, stone: 5 } },
      { id: 'storehouse', durationMinutes: 10, requires: ['farm'], cost: { timber: 20, stone: 15 } },
    ];
    const now = 600_000;
    const result = advanceAndStartNextBuild(
      {
        completed: [],
        active: { id: 'farm', startedAt: 0, completesAt: 300_000 },
        timber: 50,
        stone: 50,
      },
      definitions,
      ['farm', 'storehouse'],
      now,
    );

    expect(result.state.completed).toContain('farm');
    expect(result.started).toBe('storehouse');
    expect(result.state.active?.completesAt).toBe(now + 10 * 60_000);
  });

  it('persists multi-trip discovery and completes a ruin only once', () => {
    let ledger = createExplorationLedger();
    const first = recordExpedition(
      ledger,
      { locationId: 'ruin-1', success: true, discoveryProgress: 60, suppliesSpent: 3, rewards: {}, note: 'first pass' },
      'ruin',
    );
    ledger = first.ledger;
    const second = recordExpedition(
      ledger,
      { locationId: 'ruin-1', success: true, discoveryProgress: 50, suppliesSpent: 3, rewards: {}, note: 'second pass' },
      'ruin',
    );
    const third = recordExpedition(
      second.ledger,
      { locationId: 'ruin-1', success: true, discoveryProgress: 10, suppliesSpent: 1, rewards: {}, note: 'return visit' },
      'ruin',
    );

    expect(first.discovery).toBe(60);
    expect(second.discovery).toBe(100);
    expect(second.newlyCompletedRuin).toBe(true);
    expect(third.newlyCompletedRuin).toBe(false);
    expect(third.ledger.completedRuins).toEqual(['ruin-1']);
  });

  it('recovers wounded forces and restores only the matching player snapshot', () => {
    const snapshot = createRecoveredCampaignSnapshot(
      'player-1',
      {
        heroId: 'hero-arden',
        force: { survivors: 6, forceCap: 10, wounded: 4 },
        completedLocations: ['camp-a', 'camp-a'],
      },
      10,
      1_000,
    );

    const restored = restoreCampaignSnapshot(snapshot, 'player-1');
    expect(restored.force).toEqual({ survivors: 8, forceCap: 10, wounded: 2 });
    expect(restored.completedLocations).toEqual(['camp-a']);
    expect(() => restoreCampaignSnapshot(snapshot, 'player-2')).toThrow('invalid campaign snapshot');
  });

  it('grants only known test-mode, non-combat-power store entitlements idempotently', () => {
    expect(TEST_STORE_CATALOG.every((item) => item.combatPower === false)).toBe(true);
    const receipt = { id: 'test-receipt-1', sku: 'founder_ember', mode: 'test' as const, grantedAt: 1_000 };
    const first = grantTestStorePurchase({ receipts: [], unlockedSkus: [] }, receipt);
    const second = grantTestStorePurchase(first, receipt);

    expect(second.receipts).toHaveLength(1);
    expect(second.unlockedSkus).toEqual(['founder_ember']);
    expect(() => grantTestStorePurchase(first, { ...receipt, id: 'bad', sku: 'unknown' })).toThrow('unknown test store sku');
    expect(() => grantTestStorePurchase(first, { ...receipt, id: 'live', mode: 'live' as never })).toThrow('live entitlement receipts are not accepted');
  });
});
