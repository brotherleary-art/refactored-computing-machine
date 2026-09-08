import { assignSettlementWorkers, type WorkAssignmentRequest } from './settlementWorkAssignments';
import {
  applyProductionTick,
  type ProductionSource,
  type ProductionTickResult,
  type ResourceWallet,
} from './settlementProduction';

export interface SettlementTurnInput {
  wallet: ResourceWallet;
  storageCap: ResourceWallet;
  availablePopulation: number;
  assignments: WorkAssignmentRequest[];
  sources: ProductionSource[];
  minutes: number;
  moraleModifier?: number;
}

export interface SettlementTurnResult extends ProductionTickResult {
  assignedWorkers: Record<string, number>;
  unassignedPopulation: number;
}

export function runSettlementTurn(input: SettlementTurnInput): SettlementTurnResult {
  const workforce = assignSettlementWorkers(input.availablePopulation, input.assignments);
  const staffedSources = input.sources.map((source) => ({
    ...source,
    staffed: (workforce.assigned[source.id] ?? 0) > 0,
  }));

  const production = applyProductionTick(
    input.wallet,
    input.storageCap,
    staffedSources,
    input.minutes,
    input.moraleModifier ?? 1,
  );

  return {
    ...production,
    assignedWorkers: workforce.assigned,
    unassignedPopulation: workforce.unassigned,
  };
}
