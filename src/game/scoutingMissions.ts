export type ScoutSiteKind = 'resource' | 'hostile' | 'ruin';

export interface ScoutMission {
  siteId: string;
  kind: ScoutSiteKind;
  startedAt: number;
  readyAt: number;
  risk: number;
}

export interface ScoutResult {
  siteId: string;
  discovered: true;
  intel: number;
  suppliesFound: number;
}

const BASE_SECONDS: Record<ScoutSiteKind, number> = { resource: 15, hostile: 30, ruin: 45 };

export const startScoutMission = (
  siteId: string,
  kind: ScoutSiteKind,
  risk: number,
  now: number,
  active: ScoutMission[]
): ScoutMission[] => {
  if (active.some(mission => mission.siteId === siteId)) throw new Error('SITE_ALREADY_SCOUTING');
  if (risk < 1 || risk > 5) throw new Error('INVALID_RISK');
  return [...active, { siteId, kind, risk, startedAt: now, readyAt: now + (BASE_SECONDS[kind] + risk * 5) * 1000 }];
};

export const resolveScoutMissions = (
  active: ScoutMission[],
  discovered: Set<string>,
  now: number
): { active: ScoutMission[]; results: ScoutResult[] } => {
  const remaining: ScoutMission[] = [];
  const results: ScoutResult[] = [];
  for (const mission of active) {
    if (mission.readyAt > now) {
      remaining.push(mission);
      continue;
    }
    if (!discovered.has(mission.siteId)) {
      results.push({
        siteId: mission.siteId,
        discovered: true,
        intel: mission.kind === 'ruin' ? 3 + mission.risk : 1 + mission.risk,
        suppliesFound: mission.kind === 'resource' ? 10 + mission.risk * 5 : 0,
      });
      discovered.add(mission.siteId);
    }
  }
  return { active: remaining, results };
};
