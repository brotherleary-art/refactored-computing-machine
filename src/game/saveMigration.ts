export interface SaveEnvelopeV1 {
  version: 1;
  playerId: string;
  updatedAt: number;
  payload: Record<string, unknown>;
}

export interface SaveEnvelopeV2 {
  version: 2;
  playerId: string;
  updatedAt: number;
  payload: Record<string, unknown>;
  campaign: {
    regionId: string;
    objectiveId: string;
  };
}

export type SaveEnvelope = SaveEnvelopeV1 | SaveEnvelopeV2;

export interface SaveRecoveryResult {
  save: SaveEnvelopeV2;
  migrated: boolean;
  recoveredFromInvalid: boolean;
}

export const createFreshSave = (playerId: string, now = Date.now()): SaveEnvelopeV2 => ({
  version: 2,
  playerId,
  updatedAt: now,
  payload: {},
  campaign: { regionId: 'ashfall-march', objectiveId: 'stabilize-hold' },
});

export function recoverOrMigrateSave(raw: unknown, playerId: string, now = Date.now()): SaveRecoveryResult {
  if (!raw || typeof raw !== 'object') {
    return { save: createFreshSave(playerId, now), migrated: false, recoveredFromInvalid: true };
  }

  const candidate = raw as Partial<SaveEnvelope>;
  if (candidate.version === 2 && candidate.playerId === playerId && candidate.payload && typeof candidate.payload === 'object') {
    const v2 = candidate as SaveEnvelopeV2;
    if (v2.campaign && typeof v2.campaign.regionId === 'string' && typeof v2.campaign.objectiveId === 'string') {
      return { save: v2, migrated: false, recoveredFromInvalid: false };
    }
  }

  if (candidate.version === 1 && candidate.playerId === playerId && candidate.payload && typeof candidate.payload === 'object') {
    const v1 = candidate as SaveEnvelopeV1;
    return {
      save: {
        version: 2,
        playerId: v1.playerId,
        updatedAt: Math.max(v1.updatedAt, now),
        payload: v1.payload,
        campaign: { regionId: 'ashfall-march', objectiveId: 'stabilize-hold' },
      },
      migrated: true,
      recoveredFromInvalid: false,
    };
  }

  return { save: createFreshSave(playerId, now), migrated: false, recoveredFromInvalid: true };
}
