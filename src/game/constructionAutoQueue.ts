import {
  advanceBuildQueue,
  startBuild,
  type BuildDefinition,
  type BuildQueueState,
} from './buildQueueRuntime';

export interface ConstructionAdvanceResult {
  state: BuildQueueState;
  started?: string;
  blocked?: 'missing-definition' | 'missing-prerequisites' | 'insufficient-resources';
}

export function advanceAndStartNextBuild(
  state: BuildQueueState,
  definitions: BuildDefinition[],
  orderedPlan: string[],
  now: number,
): ConstructionAdvanceResult {
  const advanced = advanceBuildQueue(state, now);
  if (advanced.active) return { state: advanced };

  const nextId = orderedPlan.find((id) => !advanced.completed.includes(id));
  if (!nextId) return { state: advanced };

  const definition = definitions.find((candidate) => candidate.id === nextId);
  if (!definition) return { state: advanced, blocked: 'missing-definition' };
  if (!definition.requires.every((id) => advanced.completed.includes(id))) {
    return { state: advanced, blocked: 'missing-prerequisites' };
  }
  if (advanced.timber < definition.cost.timber || advanced.stone < definition.cost.stone) {
    return { state: advanced, blocked: 'insufficient-resources' };
  }

  return {
    state: startBuild(advanced, definition, now),
    started: definition.id,
  };
}
