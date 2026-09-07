export type TestPurchaseStatus = 'verified' | 'refunded' | 'cancelled';

export interface TestPurchaseEvent {
  eventId: string;
  offerId: string;
  playerId: string;
  status: TestPurchaseStatus;
  testMode: boolean;
  occurredAt: number;
}

export interface PurchaseAuditSummary {
  accepted: TestPurchaseEvent[];
  rejected: TestPurchaseEvent[];
  activeOffers: string[];
}

export function auditTestPurchases(events: TestPurchaseEvent[], playerId: string): PurchaseAuditSummary {
  const seen = new Set<string>();
  const accepted: TestPurchaseEvent[] = [];
  const rejected: TestPurchaseEvent[] = [];
  const active = new Map<string, boolean>();
  for (const event of [...events].sort((a, b) => a.occurredAt - b.occurredAt)) {
    if (!event.testMode || event.playerId !== playerId || seen.has(event.eventId)) {
      rejected.push(event);
      continue;
    }
    seen.add(event.eventId);
    accepted.push(event);
    active.set(event.offerId, event.status === 'verified');
  }
  return { accepted, rejected, activeOffers: [...active.entries()].filter(([, on]) => on).map(([id]) => id).sort() };
}
