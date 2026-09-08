import { recoverCampaignForces, type CampaignForceRecovery } from './campaignRecoveryLoop';
import { createSaveEnvelope, validateSaveEnvelope, type SaveEnvelope } from './saveIntegrity';

export interface CampaignTurnPayload {
  heroId: string;
  force: CampaignForceRecovery;
  completedLocations: string[];
}

export function createRecoveredCampaignSnapshot(
  playerId: string,
  payload: CampaignTurnPayload,
  elapsedMinutes: number,
  savedAt: number,
): SaveEnvelope<CampaignTurnPayload> {
  if (!payload.heroId) throw new Error('hero id is required');
  const recovered: CampaignTurnPayload = {
    ...payload,
    force: recoverCampaignForces(payload.force, elapsedMinutes),
    completedLocations: [...new Set(payload.completedLocations)],
  };
  return createSaveEnvelope(1, playerId, recovered, savedAt);
}

export function restoreCampaignSnapshot(
  envelope: SaveEnvelope<CampaignTurnPayload>,
  expectedPlayerId: string,
): CampaignTurnPayload {
  if (!validateSaveEnvelope(envelope, expectedPlayerId)) throw new Error('invalid campaign snapshot');
  return envelope.payload;
}
