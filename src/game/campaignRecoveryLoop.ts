export type CampaignForceRecovery = {
  survivors: number;
  forceCap: number;
  wounded: number;
};

export function recoverCampaignForces(
  state: CampaignForceRecovery,
  elapsedMinutes: number,
): CampaignForceRecovery {
  if (!Number.isFinite(elapsedMinutes) || elapsedMinutes < 0) throw new Error('elapsed minutes must be non-negative');
  if (state.forceCap < 0 || state.survivors < 0 || state.wounded < 0) throw new Error('force values must be non-negative');
  const treatmentSlots = Math.floor(elapsedMinutes / 5);
  const healed = Math.min(state.wounded, treatmentSlots, Math.max(0, state.forceCap - state.survivors));
  return {
    ...state,
    survivors: Math.min(state.forceCap, state.survivors + healed),
    wounded: Math.max(0, state.wounded - healed),
  };
}
