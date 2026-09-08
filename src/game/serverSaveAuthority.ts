export interface SaveEnvelope<T> {
  playerId: string;
  revision: number;
  savedAt: number;
  payload: T;
}

export interface SaveWrite<T> {
  playerId: string;
  expectedRevision: number;
  payload: T;
}

export type SaveWriteResult<T> =
  | { accepted: true; save: SaveEnvelope<T> }
  | { accepted: false; reason: 'PLAYER_MISMATCH' | 'STALE_REVISION'; current: SaveEnvelope<T> };

export function createAuthoritativeSave<T>(playerId: string, payload: T, now: number): SaveEnvelope<T> {
  if (!playerId.trim()) throw new Error('PLAYER_ID_REQUIRED');
  return { playerId, revision: 1, savedAt: now, payload };
}

export function applyAuthoritativeSave<T>(current: SaveEnvelope<T>, write: SaveWrite<T>, now: number): SaveWriteResult<T> {
  if (write.playerId !== current.playerId) return { accepted: false, reason: 'PLAYER_MISMATCH', current };
  if (write.expectedRevision !== current.revision) return { accepted: false, reason: 'STALE_REVISION', current };
  return {
    accepted: true,
    save: { playerId: current.playerId, revision: current.revision + 1, savedAt: now, payload: write.payload },
  };
}

export function chooseAuthoritativeSave<T>(server: SaveEnvelope<T>, client: SaveEnvelope<T>): SaveEnvelope<T> {
  if (server.playerId !== client.playerId) return server;
  if (client.revision > server.revision) return server;
  return server;
}
