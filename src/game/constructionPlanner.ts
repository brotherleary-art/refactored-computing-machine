export interface PlannedBuild {
  id: string;
  label: string;
  priority: number;
  requires?: string[];
  affordable: boolean;
  queued?: boolean;
  completed?: boolean;
}

export interface ConstructionPlan {
  next: PlannedBuild | null;
  blocked: PlannedBuild[];
  ready: PlannedBuild[];
}

export function planConstruction(builds: PlannedBuild[]): ConstructionPlan {
  const completed = new Set(builds.filter(b => b.completed).map(b => b.id));
  const candidates = builds.filter(b => !b.completed && !b.queued);
  const blocked = candidates.filter(b => (b.requires ?? []).some(req => !completed.has(req)));
  const ready = candidates
    .filter(b => !blocked.includes(b) && b.affordable)
    .sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label));
  return { next: ready[0] ?? null, blocked, ready };
}
