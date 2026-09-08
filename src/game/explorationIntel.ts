export type ExplorationIntelState = {
  intel: number;
  revealThreshold: number;
  revealed: boolean;
};

export function surveyLocation(state: ExplorationIntelState, gainedIntel: number): ExplorationIntelState {
  if (!Number.isFinite(gainedIntel) || gainedIntel < 0) throw new Error('gainedIntel must be non-negative');
  if (state.revealThreshold <= 0) throw new Error('revealThreshold must be positive');
  const intel = Math.max(0, state.intel) + gainedIntel;
  return { ...state, intel, revealed: state.revealed || intel >= state.revealThreshold };
}

export function decayIntel(state: ExplorationIntelState, elapsedHours: number): ExplorationIntelState {
  if (!Number.isFinite(elapsedHours) || elapsedHours < 0) throw new Error('elapsedHours must be non-negative');
  const decay = Math.floor(elapsedHours / 6);
  return { ...state, intel: Math.max(0, state.intel - decay) };
}
