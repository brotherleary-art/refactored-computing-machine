import type { ResourceKey } from './settlementProduction';

export type WorkAssignmentRequest = {
  id: string;
  resource: ResourceKey;
  requested: number;
};

export type WorkAssignmentResult = {
  assigned: Record<string, number>;
  staffedResources: ResourceKey[];
  unassigned: number;
};

export function assignSettlementWorkers(
  availablePopulation: number,
  requests: WorkAssignmentRequest[],
): WorkAssignmentResult {
  if (!Number.isInteger(availablePopulation) || availablePopulation < 0) {
    throw new Error('available population must be a non-negative integer');
  }

  let remaining = availablePopulation;
  const assigned: Record<string, number> = {};
  const staffed = new Set<ResourceKey>();

  for (const request of requests) {
    if (!request.id) throw new Error('work assignment id is required');
    if (!Number.isInteger(request.requested) || request.requested < 0) {
      throw new Error('requested workers must be a non-negative integer');
    }
    if (assigned[request.id] !== undefined) throw new Error(`duplicate work assignment: ${request.id}`);
    const workers = Math.min(remaining, request.requested);
    assigned[request.id] = workers;
    remaining -= workers;
    if (workers > 0) staffed.add(request.resource);
  }

  return { assigned, staffedResources: [...staffed], unassigned: remaining };
}
