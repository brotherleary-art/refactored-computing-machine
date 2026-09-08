export type CampaignSaveV1 = {
  version: 1;
  playerId: string;
  savedAt: string;
  hero: { id: string; level: number; hp: number };
  combat: { encounterId: string | null; turn: number; enemyHp: number; resolved: boolean };
  exploration: { visited: string[]; ruins: string[]; supplies: number };
};

export function createCampaignSave(input: Omit<CampaignSaveV1, 'version'>): CampaignSaveV1 {
  if (!input.playerId) throw new Error('playerId is required');
  if (input.hero.level < 1) throw new Error('hero level must be positive');
  return structuredClone({ version: 1 as const, ...input });
}

export function restoreCampaignSave(serialized: string, playerId: string): CampaignSaveV1 {
  const parsed: unknown = JSON.parse(serialized);
  if (!parsed || typeof parsed !== 'object') throw new Error('invalid save payload');
  const save = parsed as Partial<CampaignSaveV1>;
  if (save.version !== 1) throw new Error('unsupported save version');
  if (save.playerId !== playerId) throw new Error('save does not belong to this player');
  if (!save.hero || !save.combat || !save.exploration) throw new Error('incomplete save payload');
  return structuredClone(save as CampaignSaveV1);
}
