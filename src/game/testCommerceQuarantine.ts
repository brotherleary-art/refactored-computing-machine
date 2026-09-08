export interface TestOfferDefinition { id: string; amountCents: number; currency: 'usd'; }
export interface TestPurchaseEvent {
  eventId: string;
  offerId: string;
  amountCents: number;
  currency: string;
  mode: 'test' | 'live';
  verified: boolean;
}
export type QuarantineDecision =
  | { status: 'approved'; eventId: string }
  | { status: 'quarantined'; eventId: string; reason: string };

export function reviewTestPurchase(
  event: TestPurchaseEvent,
  offers: readonly TestOfferDefinition[],
  processedEventIds: ReadonlySet<string>,
): QuarantineDecision {
  if (event.mode !== 'test') return { status: 'quarantined', eventId: event.eventId, reason: 'LIVE_MODE_DISABLED' };
  if (!event.verified) return { status: 'quarantined', eventId: event.eventId, reason: 'UNVERIFIED_EVENT' };
  if (processedEventIds.has(event.eventId)) return { status: 'quarantined', eventId: event.eventId, reason: 'DUPLICATE_EVENT' };
  const offer = offers.find(candidate => candidate.id === event.offerId);
  if (!offer) return { status: 'quarantined', eventId: event.eventId, reason: 'UNKNOWN_OFFER' };
  if (event.currency !== offer.currency) return { status: 'quarantined', eventId: event.eventId, reason: 'CURRENCY_MISMATCH' };
  if (event.amountCents !== offer.amountCents) return { status: 'quarantined', eventId: event.eventId, reason: 'AMOUNT_MISMATCH' };
  return { status: 'approved', eventId: event.eventId };
}
