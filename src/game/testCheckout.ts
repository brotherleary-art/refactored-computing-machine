import { STORE_OFFERS } from './storefront.js';

export interface TestCheckoutSession {
  sessionId: string;
  offerId: string;
  amountUsdCents: number;
  recurring: boolean;
  mode: 'test';
  status: 'created' | 'verified' | 'cancelled';
}

export const createTestCheckoutSession = (offerId: string, sessionId: string): TestCheckoutSession => {
  const offer = STORE_OFFERS.find(item => item.id === offerId);
  if (!offer) throw new Error('UNKNOWN_OFFER');
  if (offer.status !== 'test_only') throw new Error('LIVE_CHECKOUT_FORBIDDEN');
  return {
    sessionId,
    offerId,
    amountUsdCents: offer.priceUsdCents,
    recurring: offer.recurring,
    mode: 'test',
    status: 'created',
  };
};

export const verifyTestCheckoutSession = (session: TestCheckoutSession, providerMode: 'test' | 'live'): TestCheckoutSession => {
  if (providerMode !== 'test' || session.mode !== 'test') throw new Error('LIVE_PROVIDER_FORBIDDEN');
  if (session.status !== 'created') throw new Error('SESSION_NOT_PENDING');
  return { ...session, status: 'verified' };
};

export const cancelTestCheckoutSession = (session: TestCheckoutSession): TestCheckoutSession => {
  if (session.status === 'verified') throw new Error('VERIFIED_SESSION_IMMUTABLE');
  return { ...session, status: 'cancelled' };
};
