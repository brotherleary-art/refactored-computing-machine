import type { EntitlementId } from './entitlements';

export interface TestEntitlementState {
  entitlements: EntitlementId[];
  processedEventIds: string[];
  combatPowerDelta: 0;
}

export interface VerifiedTestPurchaseEvent {
  eventId: string;
  entitlementId: EntitlementId;
  verified: boolean;
}

export const createTestEntitlementState = (): TestEntitlementState => ({
  entitlements: [],
  processedEventIds: [],
  combatPowerDelta: 0,
});

export const applyVerifiedTestPurchase = (
  state: TestEntitlementState,
  event: VerifiedTestPurchaseEvent
): TestEntitlementState => {
  if (!event.verified) throw new Error('UNVERIFIED_TEST_EVENT');
  if (state.processedEventIds.includes(event.eventId)) return state;
  return {
    entitlements: state.entitlements.includes(event.entitlementId)
      ? state.entitlements
      : [...state.entitlements, event.entitlementId],
    processedEventIds: [...state.processedEventIds, event.eventId],
    combatPowerDelta: 0,
  };
};
