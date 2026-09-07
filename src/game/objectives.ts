export type ObjectiveId =
  | 'stabilize_hold'
  | 'open_meridian'
  | 'recover_lens'
  | 'defeat_guardian'
  | 'secure_roads'
  | 'prepare_expansion';

export interface ObjectiveState {
  progress: number;
  ruinExposed: boolean;
  expeditionCompleted: boolean;
  guardianVictory: boolean;
  brokenPikeVictory: boolean;
  greyBannerVictory: boolean;
}

export interface Objective {
  id: ObjectiveId;
  title: string;
  complete: boolean;
}

export function getObjectives(state: ObjectiveState): Objective[] {
  return [
    { id: 'stabilize_hold', title: 'Stabilize Ashfall Hold', complete: state.progress >= 55 },
    { id: 'open_meridian', title: 'Open the Buried Meridian', complete: state.ruinExposed },
    { id: 'recover_lens', title: 'Recover the Meridian Lens', complete: state.expeditionCompleted },
    { id: 'defeat_guardian', title: 'Defeat the Meridian Guardian', complete: state.guardianVictory },
    { id: 'secure_roads', title: 'Clear both hostile road forces', complete: state.brokenPikeVictory && state.greyBannerVictory },
    { id: 'prepare_expansion', title: 'Prepare Ashfall for regional expansion', complete: state.guardianVictory && state.brokenPikeVictory && state.greyBannerVictory },
  ];
}

export function getCurrentObjective(state: ObjectiveState): Objective {
  const objectives = getObjectives(state);
  return objectives.find(objective => !objective.complete) ?? objectives[objectives.length - 1];
}
