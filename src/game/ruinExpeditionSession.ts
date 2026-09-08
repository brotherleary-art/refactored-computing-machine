export type ExpeditionPhase = 'ready' | 'active' | 'completed' | 'failed';

export interface ExpeditionSession {
  ruinId: string;
  heroId: string;
  phase: ExpeditionPhase;
  progress: number;
  danger: number;
  supplies: number;
  rewardClaimed: boolean;
}

export function startExpedition(ruinId: string, heroId: string, supplies: number): ExpeditionSession {
  if (!ruinId || !heroId) throw new Error('Ruin and hero are required');
  if (supplies <= 0) throw new Error('Expedition requires supplies');
  return { ruinId, heroId, phase: 'active', progress: 0, danger: 0, supplies, rewardClaimed: false };
}

export function resolveExpeditionStep(session: ExpeditionSession, progressGain: number, dangerGain: number, supplyCost: number): ExpeditionSession {
  if (session.phase !== 'active') throw new Error('Expedition is not active');
  if (supplyCost < 0 || progressGain < 0) throw new Error('Invalid expedition step');
  if (session.supplies < supplyCost) return { ...session, phase: 'failed', danger: Math.min(100, session.danger + Math.max(0, dangerGain)) };
  const progress = Math.min(100, session.progress + progressGain);
  const danger = Math.min(100, session.danger + Math.max(0, dangerGain));
  const phase: ExpeditionPhase = danger >= 100 ? 'failed' : progress >= 100 ? 'completed' : 'active';
  return { ...session, progress, danger, supplies: session.supplies - supplyCost, phase };
}

export function claimExpeditionReward(session: ExpeditionSession): ExpeditionSession {
  if (session.phase !== 'completed') throw new Error('Expedition is not complete');
  if (session.rewardClaimed) throw new Error('Reward already claimed');
  return { ...session, rewardClaimed: true };
}
