import { describe, expect, it } from 'vitest';
import { reconcileTestEntitlements } from '../src/game/entitlementReconciliation';

describe('test entitlement reconciliation', () => {
  it('derives active sandbox entitlements from ordered grant and revoke events', () => {
    const result = reconcileTestEntitlements('player-1', [
      { id: 'evt-2', sequence: 2, mode: 'test', playerId: 'player-1', entitlementId: 'founder-banner', kind: 'revoke' },
      { id: 'evt-1', sequence: 1, mode: 'test', playerId: 'player-1', entitlementId: 'founder-banner', kind: 'grant' },
      { id: 'evt-3', sequence: 3, mode: 'test', playerId: 'player-1', entitlementId: 'extra-loadout', kind: 'grant' },
    ]);
    expect(result.active).toEqual(['extra-loadout']);
    expect(result.processedEventIds).toEqual(['evt-1', 'evt-2', 'evt-3']);
  });

  it('rejects live events, duplicates, cross-player events, and combat-power grants', () => {
    expect(() => reconcileTestEntitlements('player-1', [
      { id: 'evt-live', sequence: 1, mode: 'live', playerId: 'player-1', entitlementId: 'x', kind: 'grant' },
    ])).toThrow('LIVE_EVENT_REJECTED');
    expect(() => reconcileTestEntitlements('player-1', [
      { id: 'dup', sequence: 1, mode: 'test', playerId: 'player-1', entitlementId: 'x', kind: 'grant' },
      { id: 'dup', sequence: 2, mode: 'test', playerId: 'player-1', entitlementId: 'x', kind: 'revoke' },
    ])).toThrow('DUPLICATE_EVENT');
    expect(() => reconcileTestEntitlements('player-1', [
      { id: 'other', sequence: 1, mode: 'test', playerId: 'player-2', entitlementId: 'x', kind: 'grant' },
    ])).toThrow('PLAYER_MISMATCH');
    expect(() => reconcileTestEntitlements('player-1', [
      { id: 'power', sequence: 1, mode: 'test', playerId: 'player-1', entitlementId: 'power-pack', kind: 'grant', grantsCombatPower: true },
    ])).toThrow('COMBAT_POWER_ENTITLEMENT_REJECTED');
  });
});
