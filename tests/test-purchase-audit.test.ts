import { describe, expect, it } from 'vitest';
import { auditTestPurchases } from '../src/game/testPurchaseAudit.js';

describe('test purchase audit', () => {
  it('rejects live, cross-player, and replayed events while honoring refunds', () => {
    const events = [
      { eventId: 'e1', offerId: 'founder-bronze', playerId: 'p1', status: 'verified' as const, testMode: true, occurredAt: 1 },
      { eventId: 'e1', offerId: 'founder-bronze', playerId: 'p1', status: 'verified' as const, testMode: true, occurredAt: 2 },
      { eventId: 'e2', offerId: 'season-zero', playerId: 'p2', status: 'verified' as const, testMode: true, occurredAt: 3 },
      { eventId: 'e3', offerId: 'season-zero', playerId: 'p1', status: 'verified' as const, testMode: false, occurredAt: 4 },
      { eventId: 'e4', offerId: 'founder-bronze', playerId: 'p1', status: 'refunded' as const, testMode: true, occurredAt: 5 },
    ];
    const audit = auditTestPurchases(events, 'p1');
    expect(audit.accepted.map(e => e.eventId)).toEqual(['e1', 'e4']);
    expect(audit.rejected).toHaveLength(3);
    expect(audit.activeOffers).toEqual([]);
  });
});
