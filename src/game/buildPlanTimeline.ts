import { BUILDINGS, getScaledBuildSeconds, type BuildingId } from './buildings';

export interface BuildPlanStep { building: BuildingId; targetLevel: number; }
export interface ScheduledBuildStep extends BuildPlanStep { startAt: number; finishAt: number; }

export function scheduleBuildPlan(
  steps: BuildPlanStep[],
  currentLevels: Partial<Record<BuildingId, number>>,
  startAt: number,
): ScheduledBuildStep[] {
  const levels = { ...currentLevels };
  const scheduled: ScheduledBuildStep[] = [];
  let cursor = startAt;

  for (const step of steps) {
    const definition = BUILDINGS[step.building];
    if (!definition) throw new Error('UNKNOWN_BUILDING');
    const current = levels[step.building] ?? 0;
    if (step.targetLevel !== current + 1) throw new Error('NON_SEQUENTIAL_LEVEL');
    if (step.targetLevel > definition.maxLevel) throw new Error('MAX_LEVEL_REACHED');
    for (const [requiredId, requiredLevel] of Object.entries(definition.requires ?? {})) {
      if ((levels[requiredId as BuildingId] ?? 0) < (requiredLevel ?? 0)) throw new Error(`MISSING_PREREQUISITE:${requiredId}`);
    }
    const finishAt = cursor + getScaledBuildSeconds(definition, step.targetLevel) * 1000;
    scheduled.push({ ...step, startAt: cursor, finishAt });
    levels[step.building] = step.targetLevel;
    cursor = finishAt;
  }
  return scheduled;
}
