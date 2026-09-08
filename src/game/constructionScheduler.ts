export type BuildingDefinition = {
  id: string;
  buildMinutes: number;
  requires?: Record<string, number>;
};

export type ConstructionTask = {
  buildingId: string;
  finishesAtMinute: number;
};

export type ConstructionState = {
  minute: number;
  buildings: Record<string, number>;
  queue: ConstructionTask[];
  queueSlots: number;
};

export function canScheduleBuilding(state: ConstructionState, definition: BuildingDefinition): boolean {
  if (state.queue.length >= state.queueSlots) return false;
  return Object.entries(definition.requires ?? {}).every(([id, level]) => (state.buildings[id] ?? 0) >= level);
}

export function scheduleBuilding(state: ConstructionState, definition: BuildingDefinition): ConstructionState {
  if (!canScheduleBuilding(state, definition)) throw new Error('building prerequisites or queue capacity not satisfied');
  const lastFinish = state.queue.reduce((max, task) => Math.max(max, task.finishesAtMinute), state.minute);
  return {
    ...state,
    queue: [...state.queue, { buildingId: definition.id, finishesAtMinute: lastFinish + definition.buildMinutes }],
  };
}

export function advanceConstruction(state: ConstructionState, toMinute: number): ConstructionState {
  if (toMinute < state.minute) throw new Error('construction time cannot move backward');
  const complete = state.queue.filter((task) => task.finishesAtMinute <= toMinute);
  const buildings = { ...state.buildings };
  for (const task of complete) buildings[task.buildingId] = (buildings[task.buildingId] ?? 0) + 1;
  return {
    ...state,
    minute: toMinute,
    buildings,
    queue: state.queue.filter((task) => task.finishesAtMinute > toMinute),
  };
}
