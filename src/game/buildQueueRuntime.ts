export interface BuildDefinition {
  id: string;
  durationMinutes: number;
  requires: string[];
  cost: { timber: number; stone: number };
}

export interface BuildQueueState {
  completed: string[];
  active?: { id: string; startedAt: number; completesAt: number };
  timber: number;
  stone: number;
}

export function startBuild(state: BuildQueueState, definition: BuildDefinition, now: number): BuildQueueState {
  if (state.active) throw new Error('construction queue is busy');
  if (!definition.requires.every((id) => state.completed.includes(id))) throw new Error('missing prerequisites');
  if (state.timber < definition.cost.timber || state.stone < definition.cost.stone) throw new Error('insufficient resources');
  if (definition.durationMinutes <= 0) throw new Error('duration must be positive');
  return {
    ...state,
    timber: state.timber - definition.cost.timber,
    stone: state.stone - definition.cost.stone,
    active: { id: definition.id, startedAt: now, completesAt: now + definition.durationMinutes * 60_000 },
  };
}

export function advanceBuildQueue(state: BuildQueueState, now: number): BuildQueueState {
  if (!state.active || now < state.active.completesAt) return state;
  return {
    ...state,
    completed: state.completed.includes(state.active.id) ? state.completed : [...state.completed, state.active.id],
    active: undefined,
  };
}
