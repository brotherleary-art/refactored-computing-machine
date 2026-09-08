export interface VerticalSliceSnapshot {
  playerId: string;
  revision: number;
  region: string;
  hero: string;
  battleTurn: number;
  checksum: string;
}

const checksumFor = (snapshot: Omit<VerticalSliceSnapshot, 'checksum'>) =>
  `${snapshot.playerId}:${snapshot.revision}:${snapshot.region}:${snapshot.hero}:${snapshot.battleTurn}`;

export function createVerticalSliceSession(snapshot: Omit<VerticalSliceSnapshot, 'checksum'>): VerticalSliceSnapshot {
  return { ...snapshot, checksum: checksumFor(snapshot) };
}

export function resumeVerticalSliceSession(snapshot: VerticalSliceSnapshot, playerId: string): VerticalSliceSnapshot {
  if (snapshot.playerId !== playerId) throw new Error('PLAYER_MISMATCH');
  const { checksum, ...unsigned } = snapshot;
  if (checksum !== checksumFor(unsigned)) throw new Error('INVALID_SESSION_CHECKSUM');
  return { ...snapshot };
}
