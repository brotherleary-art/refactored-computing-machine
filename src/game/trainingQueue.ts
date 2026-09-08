import { UNIT_TYPES, canTrainUnit, trainUnit } from './units.js';
import type { ResourceWallet, UnitId } from './units.js';

export interface TrainingOrder {
  id: string;
  unitId: UnitId;
  count: number;
  queuedAt: number;
  readyAt: number;
}

export type UnitRoster = Partial<Record<UnitId, number>>;

const trainingMs: Record<UnitId, number> = {
  militia: 15_000,
  archer: 20_000,
  spearguard: 24_000,
  scout_rider: 28_000,
  sapper: 34_000,
  warden: 40_000,
};

export function createTrainingQueue(): TrainingOrder[] { return []; }

export function queueTraining(
  queue: TrainingOrder[],
  unitId: UnitId,
  count: number,
  wallet: ResourceWallet,
  buildings: string[],
  now = Date.now(),
) {
  if (!canTrainUnit(unitId, wallet, buildings, count)) throw new Error(`Cannot train ${count} ${unitId}.`);
  const purchase = trainUnit(unitId, count, wallet, buildings);
  const tail = queue.reduce((latest, order) => Math.max(latest, order.readyAt), now);
  const order: TrainingOrder = {
    id: `${unitId}-${now}-${queue.length}`,
    unitId,
    count,
    queuedAt: now,
    readyAt: tail + trainingMs[unitId] * count,
  };
  return { queue: [...queue, order], wallet: purchase.wallet, order };
}

export function completeReadyTraining(queue: TrainingOrder[], roster: UnitRoster, now = Date.now()) {
  const nextRoster: UnitRoster = { ...roster };
  const pending: TrainingOrder[] = [];
  for (const order of queue) {
    if (order.readyAt <= now) nextRoster[order.unitId] = (nextRoster[order.unitId] ?? 0) + order.count;
    else pending.push(order);
  }
  return { queue: pending, roster: nextRoster };
}

export function unitTrainingTime(unitId: UnitId): number {
  return trainingMs[unitId];
}

export function requiredBuildingFor(unitId: UnitId): string {
  return UNIT_TYPES.find((unit) => unit.id === unitId)?.requiredBuilding ?? '';
}
