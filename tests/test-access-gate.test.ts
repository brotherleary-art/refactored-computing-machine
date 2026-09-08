import { describe, expect, it } from 'vitest';
import { evaluateTestAccess } from '../src/game/testAccessGate.js';

describe('test entitlement access gate', () => {
  it('allows an active test entitlement without granting combat power', () => {
    const result = evaluateTestAccess({ requested: 'founder-cosmetics', activeEntitlements: ['founder-cosmetics'], now: 100, expiresAt: 200, testMode: true });
    expect(result.allowed).toBe(true);
    expect(result.grantsCombatPower).toBe(false);
  });

  it('rejects live mode and expired entitlements', () => {
    expect(evaluateTestAccess({ requested: 'supporter-badge', activeEntitlements: ['supporter-badge'], now: 100, testMode: false }).reason).toBe('test-mode-required');
    expect(evaluateTestAccess({ requested: 'extra-loadout-slots', activeEntitlements: ['extra-loadout-slots'], now: 300, expiresAt: 200, testMode: true }).reason).toBe('expired');
  });
});
