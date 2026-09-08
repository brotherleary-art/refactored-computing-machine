import { describe, expect, it } from 'vitest';
import { reviewTestPurchase } from '../src/game/testCommerceQuarantine';

const offers = [{ id: 'founder-banner', amountCents: 499, currency: 'usd' as const }];

describe('test commerce quarantine', () => {
  it('approves an exact verified sandbox event', () => {
    expect(reviewTestPurchase({ eventId: 'evt-1', offerId: 'founder-banner', amountCents: 499, currency: 'usd', mode: 'test', verified: true }, offers, new Set()))
      .toEqual({ status: 'approved', eventId: 'evt-1' });
  });

  it('quarantines live, duplicate, and amount-mismatched events', () => {
    expect(reviewTestPurchase({ eventId: 'evt-live', offerId: 'founder-banner', amountCents: 499, currency: 'usd', mode: 'live', verified: true }, offers, new Set())).toMatchObject({ reason: 'LIVE_MODE_DISABLED' });
    expect(reviewTestPurchase({ eventId: 'evt-2', offerId: 'founder-banner', amountCents: 499, currency: 'usd', mode: 'test', verified: true }, offers, new Set(['evt-2']))).toMatchObject({ reason: 'DUPLICATE_EVENT' });
    expect(reviewTestPurchase({ eventId: 'evt-3', offerId: 'founder-banner', amountCents: 99, currency: 'usd', mode: 'test', verified: true }, offers, new Set())).toMatchObject({ reason: 'AMOUNT_MISMATCH' });
  });
});
