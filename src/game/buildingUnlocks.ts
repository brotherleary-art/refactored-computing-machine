export interface BuildingUnlockRule {
  id: string;
  requires: string[];
  minSettlementProgress?: number;
  requiresRelic?: string;
}

export interface BuildingUnlockState {
  completed: string[];
  queued: string[];
  settlementProgress: number;
  relics: string[];
}

export interface BuildingUnlockResult {
  unlocked: boolean;
  blockers: string[];
}

export const BUILDING_UNLOCKS: BuildingUnlockRule[] = [
  { id: 'farm', requires: ['hall'] },
  { id: 'lumber', requires: ['hall'] },
  { id: 'store', requires: ['hall'], minSettlementProgress: 20 },
  { id: 'barracks', requires: ['hall', 'store'], minSettlementProgress: 35 },
  { id: 'stable', requires: ['barracks'], minSettlementProgress: 55 },
  { id: 'forge', requires: ['barracks', 'store'], minSettlementProgress: 65, requiresRelic: 'Guardian Shard' },
];

export function evaluateBuildingUnlock(rule: BuildingUnlockRule, state: BuildingUnlockState): BuildingUnlockResult {
  const blockers: string[] = [];
  const done = new Set(state.completed);
  const queued = new Set(state.queued);

  for (const prerequisite of rule.requires) {
    if (!done.has(prerequisite)) blockers.push(queued.has(prerequisite) ? `waiting:${prerequisite}` : `requires:${prerequisite}`);
  }
  if ((rule.minSettlementProgress ?? 0) > state.settlementProgress) blockers.push(`progress:${rule.minSettlementProgress}`);
  if (rule.requiresRelic && !state.relics.includes(rule.requiresRelic)) blockers.push(`relic:${rule.requiresRelic}`);
  if (done.has(rule.id)) blockers.push('already-completed');
  if (queued.has(rule.id)) blockers.push('already-queued');

  return { unlocked: blockers.length === 0, blockers };
}

export function nextUnlockedBuilding(state: BuildingUnlockState): string | null {
  return BUILDING_UNLOCKS.find(rule => evaluateBuildingUnlock(rule, state).unlocked)?.id ?? null;
}
