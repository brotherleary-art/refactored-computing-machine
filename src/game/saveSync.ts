export interface RevisionedSave<T> {
  playerId: string;
  revision: number;
  updatedAt: number;
  payload: T;
}

export interface SaveWrite<T> {
  playerId: string;
  expectedRevision: number;
  payload: T;
}

export function applySaveWrite<T>(current: RevisionedSave<T>, write: SaveWrite<T>, now: number): RevisionedSave<T> {
  if (write.playerId !== current.playerId) throw new Error('PLAYER_MISMATCH');
  if (write.expectedRevision !== current.revision) throw new Error('SAVE_REVISION_CONFLICT');
  return {
    playerId: current.playerId,
    revision: current.revision + 1,
    updatedAt: now,
    payload: write.payload,
  };
}

export function chooseNewestSave<T>(local: RevisionedSave<T>, remote: RevisionedSave<T>): RevisionedSave<T> {
  if (local.playerId !== remote.playerId) throw new Error('PLAYER_MISMATCH');
  if (local.revision !== remote.revision) return local.revision > remote.revision ? local : remote;
  return local.updatedAt >= remote.updatedAt ? local : remote;
}
