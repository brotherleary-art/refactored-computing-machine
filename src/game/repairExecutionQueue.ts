export interface RepairResources { timber: number; stone: number }
export interface QueuedRepair {
  buildingId: string;
  restore: number;
  timberCost: number;
  stoneCost: number;
  startedAt: number;
  completesAt: number;
}

export function queueRepair(
  resources: RepairResources,
  active: QueuedRepair[],
  order: Omit<QueuedRepair, 'startedAt' | 'completesAt'> & { durationSeconds: number },
  now: number,
): { resources: RepairResources; active: QueuedRepair[] } {
  if (active.some(r => r.buildingId === order.buildingId)) throw new Error('Building already has an active repair');
  if (resources.timber < order.timberCost || resources.stone < order.stoneCost) throw new Error('Insufficient repair resources');
  if (order.durationSeconds <= 0) throw new Error('Repair duration must be positive');
  return {
    resources: { timber: resources.timber - order.timberCost, stone: resources.stone - order.stoneCost },
    active: [...active, { buildingId: order.buildingId, restore: order.restore, timberCost: order.timberCost, stoneCost: order.stoneCost, startedAt: now, completesAt: now + order.durationSeconds * 1000 }],
  };
}

export function collectCompletedRepairs(active: QueuedRepair[], now: number): { completed: QueuedRepair[]; active: QueuedRepair[] } {
  return {
    completed: active.filter(r => r.completesAt <= now),
    active: active.filter(r => r.completesAt > now),
  };
}
