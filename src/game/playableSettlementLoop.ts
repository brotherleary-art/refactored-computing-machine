import { runSettlementTurn } from './settlementTurn.js';
import type { ResourceKey, ResourceWallet } from './settlementProduction.js';

export interface PlayableProductionSource {
  resource: ResourceKey;
  perMinute: number;
  staffing: number;
  condition: number;
}

export interface PlayableSettlementLoopInput {
  wallet: ResourceWallet;
  storageCap: ResourceWallet;
  population: number;
  morale: number;
  minutes: number;
  sources: PlayableProductionSource[];
}

export function advanceSettlementLoop(input: PlayableSettlementLoopInput) {
  const result = runSettlementTurn({
    ...input,
    sources: input.sources.map((source, index) => ({
      id: `source-${index}`,
      resource: source.resource,
      perMinute: source.perMinute,
      staffed: source.staffing > 0,
      damageModifier: Math.max(0, Math.min(1, source.condition)),
    })),
  });
  const foodDelta = result.wallet.food - input.wallet.food;
  const sign = foodDelta >= 0 ? '+' : '';
  return { ...result, summary: `Food ${sign}${foodDelta.toFixed(1)} after upkeep and production.` };
}
