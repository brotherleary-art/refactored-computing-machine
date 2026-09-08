export type DependencyBuild = {
  id: string;
  minutes: number;
  requires: string[];
};

export type DependencyBuildStep = DependencyBuild & {
  startsAtMinute: number;
  completesAtMinute: number;
};

export function planDependencyQueue(
  requested: DependencyBuild[],
  alreadyBuilt: string[],
): DependencyBuildStep[] {
  const pending = new Map(requested.map(item => [item.id, item]));
  if (pending.size !== requested.length) throw new Error('duplicate building id');
  for (const item of requested) {
    if (!Number.isFinite(item.minutes) || item.minutes <= 0) throw new Error('build minutes must be positive');
  }

  const available = new Set(alreadyBuilt);
  const steps: DependencyBuildStep[] = [];
  let cursor = 0;

  while (pending.size) {
    const ready = [...pending.values()].find(item => item.requires.every(req => available.has(req) || pending.has(req)) && item.requires.every(req => available.has(req) || requested.some(candidate => candidate.id === req)));
    const executable = ready && ready.requires.every(req => available.has(req));
    if (!ready || !executable) {
      const next = [...pending.values()].find(item => item.requires.every(req => available.has(req)));
      if (!next) throw new Error('unresolved or cyclic building prerequisite');
      pending.delete(next.id);
      steps.push({ ...next, startsAtMinute: cursor, completesAtMinute: cursor + next.minutes });
      cursor += next.minutes;
      available.add(next.id);
      continue;
    }
    pending.delete(ready.id);
    steps.push({ ...ready, startsAtMinute: cursor, completesAtMinute: cursor + ready.minutes });
    cursor += ready.minutes;
    available.add(ready.id);
  }

  return steps;
}
