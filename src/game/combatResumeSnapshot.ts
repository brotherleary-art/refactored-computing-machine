export interface CombatResumeState {
  playerId: string;
  encounterId: string;
  turn: number;
  playerForces: number;
  enemyForces: number;
  heroIds: string[];
  resolved: boolean;
  revision: number;
}

export interface CombatSnapshot {
  state: CombatResumeState;
  integrity: string;
}

function stablePayload(state: CombatResumeState) {
  return JSON.stringify({ ...state, heroIds: [...state.heroIds] });
}

function checksum(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function createCombatSnapshot(state: CombatResumeState): CombatSnapshot {
  const safe = { ...state, heroIds: [...state.heroIds] };
  return { state: safe, integrity: checksum(stablePayload(safe)) };
}

export function restoreCombatSnapshot(snapshot: CombatSnapshot, playerId: string): CombatResumeState {
  if (snapshot.state.playerId !== playerId) throw new Error('player mismatch');
  if (snapshot.integrity !== checksum(stablePayload(snapshot.state))) throw new Error('snapshot integrity mismatch');
  return { ...snapshot.state, heroIds: [...snapshot.state.heroIds] };
}
