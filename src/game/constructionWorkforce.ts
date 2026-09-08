export type ConstructionWorkItem = {
  id: string;
  requiredBuilding?: string;
  remainingMinutes: number;
  assignedWorkers: number;
};

export function advanceConstructionWork(
  item: ConstructionWorkItem,
  ownedBuildings: string[],
  elapsedMinutes: number,
): ConstructionWorkItem {
  if (!Number.isInteger(elapsedMinutes) || elapsedMinutes < 0) throw new Error('elapsedMinutes must be non-negative integer');
  if (item.requiredBuilding && !ownedBuildings.includes(item.requiredBuilding)) {
    throw new Error(`missing prerequisite: ${item.requiredBuilding}`);
  }
  const workers = Math.max(1, Math.floor(item.assignedWorkers));
  const effectiveMinutes = elapsedMinutes * workers;
  return { ...item, remainingMinutes: Math.max(0, item.remainingMinutes - effectiveMinutes) };
}

export function reassignConstructionWorkers(
  item: ConstructionWorkItem,
  workers: number,
  settlementWorkerCap: number,
): ConstructionWorkItem {
  if (!Number.isInteger(workers) || workers < 1) throw new Error('workers must be a positive integer');
  if (workers > settlementWorkerCap) throw new Error('worker assignment exceeds settlement cap');
  return { ...item, assignedWorkers: workers };
}
