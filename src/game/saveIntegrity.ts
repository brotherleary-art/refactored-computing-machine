export interface SaveEnvelope<T> {
  version: number;
  playerId: string;
  savedAt: number;
  payload: T;
  checksum: string;
}

const stableStringify = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
};

const fnv1a = (text: string): string => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const createSaveEnvelope = <T>(version: number, playerId: string, payload: T, savedAt: number): SaveEnvelope<T> => {
  const base = { version, playerId, savedAt, payload };
  return { ...base, checksum: fnv1a(stableStringify(base)) };
};

export const validateSaveEnvelope = <T>(envelope: SaveEnvelope<T>, expectedPlayerId?: string): boolean => {
  if (expectedPlayerId && envelope.playerId !== expectedPlayerId) return false;
  const { checksum, ...base } = envelope;
  return checksum === fnv1a(stableStringify(base));
};
