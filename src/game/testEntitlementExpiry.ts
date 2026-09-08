export type TestEntitlementWindow = {
  mode: 'test' | 'live';
  startsAt: number;
  expiresAt: number;
  graceSeconds: number;
};

export type EntitlementWindowStatus = 'pending' | 'active' | 'grace' | 'expired';

export function entitlementStatus(window: TestEntitlementWindow, now: number): EntitlementWindowStatus {
  if (window.mode !== 'test') throw new Error('live entitlements are disabled in this sandbox');
  if (!Number.isFinite(now) || !Number.isFinite(window.startsAt) || !Number.isFinite(window.expiresAt) || !Number.isFinite(window.graceSeconds)) throw new Error('invalid entitlement timestamp');
  if (window.expiresAt <= window.startsAt || window.graceSeconds < 0) throw new Error('invalid entitlement window');
  if (now < window.startsAt) return 'pending';
  if (now < window.expiresAt) return 'active';
  if (now < window.expiresAt + window.graceSeconds) return 'grace';
  return 'expired';
}
