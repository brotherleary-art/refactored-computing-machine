import { describe, expect, it } from 'vitest';
import { entitlementStatus } from '../src/game/testEntitlementExpiry';

describe('test entitlement expiry', () => {
  it('treats an active test entitlement as usable before expiry', () => {
    const status = entitlementStatus({ mode: 'test', startsAt: 1000, expiresAt: 5000, graceSeconds: 600 }, 3000);
    expect(status).toBe('active');
  });

  it('supports a grace window then expires and always rejects live mode', () => {
    expect(entitlementStatus({ mode: 'test', startsAt: 1000, expiresAt: 5000, graceSeconds: 600 }, 5300)).toBe('grace');
    expect(entitlementStatus({ mode: 'test', startsAt: 1000, expiresAt: 5000, graceSeconds: 600 }, 6000)).toBe('expired');
    expect(() => entitlementStatus({ mode: 'live', startsAt: 1000, expiresAt: 5000, graceSeconds: 600 }, 3000)).toThrow();
  });
});
