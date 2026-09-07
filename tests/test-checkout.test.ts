import { describe, expect, it } from 'vitest';
import { cancelTestCheckoutSession, createTestCheckoutSession, verifyTestCheckoutSession } from '../src/game/testCheckout.js';

describe('test checkout', () => {
  it('creates sessions only from configured test offers', () => {
    const session = createTestCheckoutSession('founder-bronze', 'sess_test_1');
    expect(session.mode).toBe('test');
    expect(session.amountUsdCents).toBe(999);
    expect(() => createTestCheckoutSession('missing-offer', 'sess_test_2')).toThrow('UNKNOWN_OFFER');
  });

  it('refuses live provider verification', () => {
    const session = createTestCheckoutSession('season-zero', 'sess_test_3');
    expect(() => verifyTestCheckoutSession(session, 'live')).toThrow('LIVE_PROVIDER_FORBIDDEN');
    expect(verifyTestCheckoutSession(session, 'test').status).toBe('verified');
  });

  it('does not cancel an already verified session', () => {
    const verified = verifyTestCheckoutSession(createTestCheckoutSession('explorers-guild', 'sess_test_4'), 'test');
    expect(() => cancelTestCheckoutSession(verified)).toThrow('VERIFIED_SESSION_IMMUTABLE');
  });
});
