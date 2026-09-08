export interface CampaignCheckpoint<T> {
  playerId: string;
  revision: number;
  savedAt: number;
  state: T;
}

export function createCheckpoint<T>(playerId: string, revision: number, state: T, savedAt: number): CampaignCheckpoint<T> {
  if (!playerId) throw new Error('Player id is required');
  if (revision < 0) throw new Error('Revision cannot be negative');
  return { playerId, revision, savedAt, state: JSON.parse(JSON.stringify(state)) as T };
}

export function acceptCheckpoint<T>(current: CampaignCheckpoint<T> | null, incoming: CampaignCheckpoint<T>, expectedPlayerId: string): CampaignCheckpoint<T> {
  if (incoming.playerId !== expectedPlayerId) throw new Error('Checkpoint player mismatch');
  if (current && current.playerId !== expectedPlayerId) throw new Error('Current checkpoint player mismatch');
  if (current && incoming.revision <= current.revision) throw new Error('Checkpoint is stale');
  return createCheckpoint(incoming.playerId, incoming.revision, incoming.state, incoming.savedAt);
}

export function recoverLatestCheckpoint<T>(local: CampaignCheckpoint<T> | null, remote: CampaignCheckpoint<T> | null, expectedPlayerId: string): CampaignCheckpoint<T> | null {
  const valid = [local, remote].filter((c): c is CampaignCheckpoint<T> => !!c && c.playerId === expectedPlayerId);
  if (!valid.length) return null;
  return valid.sort((a, b) => b.revision - a.revision || b.savedAt - a.savedAt)[0];
}
