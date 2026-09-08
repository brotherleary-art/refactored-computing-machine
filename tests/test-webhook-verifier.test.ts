import { describe, expect, it } from 'vitest';
import { acceptWebhookOnce, expectedTestSignature, verifyTestWebhook } from '../src/game/testWebhookVerifier.js';

describe('test webhook verifier', () => {
  it('accepts valid test events once and blocks live or forged events', () => {
    const secret = 'test-secret';
    const unsigned = { id: 'evt-1', mode: 'test' as const, type: 'checkout.completed' as const, playerId: 'player-1', offerId: 'founder-bronze' };
    const event = { ...unsigned, signature: expectedTestSignature(secret, unsigned) };
    const verified = verifyTestWebhook(event, secret);
    const processed = new Set<string>();
    expect(acceptWebhookOnce(verified, processed)).toBe(true);
    expect(acceptWebhookOnce(verified, processed)).toBe(false);
    expect(() => verifyTestWebhook({ ...event, signature: 'bad' }, secret)).toThrow('INVALID_WEBHOOK_SIGNATURE');
    expect(() => verifyTestWebhook({ ...event, mode: 'live' }, secret)).toThrow('LIVE_COMMERCE_DISABLED');
  });
});
