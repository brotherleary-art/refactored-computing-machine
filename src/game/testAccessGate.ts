export type TestEntitlement = 'founder-cosmetics' | 'extra-loadout-slots' | 'supporter-badge';

export interface TestAccessInput {
  requested: TestEntitlement;
  activeEntitlements: TestEntitlement[];
  expiresAt?: number;
  now: number;
  testMode: boolean;
}

export interface TestAccessResult {
  allowed: boolean;
  reason: 'allowed' | 'test-mode-required' | 'missing-entitlement' | 'expired';
  grantsCombatPower: false;
}

export function evaluateTestAccess(input: TestAccessInput): TestAccessResult {
  if (!input.testMode) return { allowed: false, reason: 'test-mode-required', grantsCombatPower: false };
  if (!input.activeEntitlements.includes(input.requested)) return { allowed: false, reason: 'missing-entitlement', grantsCombatPower: false };
  if (input.expiresAt !== undefined && input.now >= input.expiresAt) return { allowed: false, reason: 'expired', grantsCombatPower: false };
  return { allowed: true, reason: 'allowed', grantsCombatPower: false };
}
