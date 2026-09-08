export type CampaignSnapshot<T> = {
  revision: number;
  savedAt: number;
  state: T;
};

export function appendCampaignSnapshot<T>(
  snapshots: CampaignSnapshot<T>[],
  state: T,
  savedAt: number,
  keep = 3,
): CampaignSnapshot<T>[] {
  if (!Number.isInteger(keep) || keep < 1) throw new Error('keep must be a positive integer');
  const revision = (snapshots.at(-1)?.revision ?? 0) + 1;
  return [...snapshots, { revision, savedAt, state }].slice(-keep);
}

export function latestCampaignSnapshot<T>(snapshots: CampaignSnapshot<T>[]): CampaignSnapshot<T> {
  const latest = snapshots.at(-1);
  if (!latest) throw new Error('no campaign snapshots available');
  return latest;
}

export function rollbackCampaignSnapshot<T>(snapshots: CampaignSnapshot<T>[], revision: number): CampaignSnapshot<T> {
  const snapshot = snapshots.find((entry) => entry.revision === revision);
  if (!snapshot) throw new Error('campaign snapshot revision not found');
  return snapshot;
}
