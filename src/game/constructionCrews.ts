export type ConstructionCrewSpec = {
  baseSeconds: number;
  minWorkers: number;
  maxWorkers: number;
};

export type ConstructionCrewPlan = {
  assignedWorkers: number;
  durationSeconds: number;
  speedMultiplier: number;
};

export function assignConstructionCrew(spec: ConstructionCrewSpec, requestedWorkers: number): ConstructionCrewPlan {
  if (spec.baseSeconds <= 0 || spec.minWorkers <= 0 || spec.maxWorkers < spec.minWorkers) throw new Error('invalid construction crew spec');
  if (!Number.isFinite(requestedWorkers) || requestedWorkers < spec.minWorkers) throw new Error('not enough workers');

  const assignedWorkers = Math.min(spec.maxWorkers, Math.floor(requestedWorkers));
  const extraWorkers = assignedWorkers - spec.minWorkers;
  const speedMultiplier = 1 + extraWorkers * 0.35;
  return {
    assignedWorkers,
    durationSeconds: Math.ceil(spec.baseSeconds / speedMultiplier),
    speedMultiplier: Math.round(speedMultiplier * 100) / 100,
  };
}
