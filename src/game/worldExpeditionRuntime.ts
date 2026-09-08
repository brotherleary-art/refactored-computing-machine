export type WorldExpeditionStatus = 'traveling' | 'arrived' | 'stranded';

export interface WorldExpeditionState {
  id: string;
  startedAt: number;
  arrivesAt: number;
  supplies: number;
  supplyCostPerStep: number;
  progress: number;
  status: WorldExpeditionStatus;
}

export function advanceWorldExpedition(input: { now: number; expedition: WorldExpeditionState }) {
  const expedition = { ...input.expedition };
  if (expedition.status !== 'traveling') return { expedition };

  const duration = Math.max(1, expedition.arrivesAt - expedition.startedAt);
  const targetProgress = Math.max(0, Math.min(100, Math.floor(((input.now - expedition.startedAt) / duration) * 100)));
  if (targetProgress <= expedition.progress) return { expedition };

  const cost = Math.max(0, expedition.supplyCostPerStep);
  if (expedition.supplies < cost) {
    expedition.status = 'stranded';
    return { expedition };
  }

  expedition.supplies -= cost;
  expedition.progress = targetProgress;
  if (input.now >= expedition.arrivesAt || expedition.progress >= 100) {
    expedition.progress = 100;
    expedition.status = 'arrived';
  }
  return { expedition };
}
