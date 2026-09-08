import type { ExpeditionResult } from './exploration';

export type ExplorationSiteType = 'resource' | 'enemy' | 'ruin' | 'landmark' | 'settlement';

export interface ExplorationLedger {
  discoveryByLocation: Record<string, number>;
  securedLocations: string[];
  completedRuins: string[];
}

export interface RecordedExpedition {
  ledger: ExplorationLedger;
  discovery: number;
  newlySecured: boolean;
  newlyCompletedRuin: boolean;
}

export function createExplorationLedger(): ExplorationLedger {
  return { discoveryByLocation: {}, securedLocations: [], completedRuins: [] };
}

export function recordExpedition(
  ledger: ExplorationLedger,
  result: ExpeditionResult,
  siteType: ExplorationSiteType,
): RecordedExpedition {
  if (!result.locationId) throw new Error('location id is required');
  const previous = ledger.discoveryByLocation[result.locationId] ?? 0;
  const discovery = Math.max(0, Math.min(100, previous + result.discoveryProgress));
  const secured = result.success && discovery >= 100;
  const newlySecured = secured && !ledger.securedLocations.includes(result.locationId);
  const newlyCompletedRuin = siteType === 'ruin' && newlySecured && !ledger.completedRuins.includes(result.locationId);

  return {
    ledger: {
      discoveryByLocation: { ...ledger.discoveryByLocation, [result.locationId]: discovery },
      securedLocations: newlySecured ? [...ledger.securedLocations, result.locationId] : [...ledger.securedLocations],
      completedRuins: newlyCompletedRuin ? [...ledger.completedRuins, result.locationId] : [...ledger.completedRuins],
    },
    discovery,
    newlySecured,
    newlyCompletedRuin,
  };
}
