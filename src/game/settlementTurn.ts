import { applyProductionTick, type ProductionSource, type ResourceWallet } from './settlementProduction.js';

export interface SettlementTurnInput {
  wallet: ResourceWallet;
  storageCap: ResourceWallet;
  population: number;
  morale: number;
  minutes: number;
  sources: ProductionSource[];
}

export interface SettlementTurnResult {
  wallet: ResourceWallet;
  production: ReturnType<typeof applyProductionTick>;
  upkeep: { foodConsumed: number; shortfall: number };
  starving: boolean;
}

export function runSettlementTurn(input: SettlementTurnInput): SettlementTurnResult {
  if (!Number.isFinite(input.minutes) || input.minutes < 0) throw new Error('minutes must be non-negative');
  const demand = Math.max(0, input.population) * 0.05 * input.minutes;
  const availableFood = Math.max(0, input.wallet.food);
  const foodConsumed = Math.min(availableFood, demand);
  const shortfall = Math.max(0, demand - foodConsumed);
  const afterUpkeep: ResourceWallet = { ...input.wallet, food: availableFood - foodConsumed };
  const production = applyProductionTick(
    afterUpkeep,
    input.storageCap,
    input.sources,
    input.minutes,
    Math.max(0, input.morale),
  );

  return {
    wallet: production.wallet,
    production,
    upkeep: { foodConsumed, shortfall },
    starving: shortfall > 0,
  };
}
