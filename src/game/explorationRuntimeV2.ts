export type ExplorationStatus = 'traveling' | 'arrived' | 'stranded';
export interface ExplorationMission {
  id: string;
  startedAt: number;
  arrivesAt: number;
  supplies: number;
  status: ExplorationStatus;
}

const names: Record<string, string> = {
  'blackglass-ridge': 'Blackglass Ridge',
  'hollow-crown': 'Hollow Crown',
  'ashfall-gate': 'Ashfall Gate',
};

export function advanceExplorationRuntime(input: { now: number; mission: ExplorationMission }) {
  const mission = { ...input.mission };
  if (mission.status === 'traveling' && mission.supplies <= 0) mission.status = 'stranded';
  else if (mission.status === 'traveling' && input.now >= mission.arrivesAt) mission.status = 'arrived';
  const label = names[mission.id] ?? mission.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const visibleEvent = mission.status === 'arrived'
    ? `${label} reached. Exploration actions are now available.`
    : mission.status === 'stranded'
      ? `${label} expedition is stranded without supplies.`
      : `${label} expedition is still traveling.`;
  return { mission, visibleEvent };
}
