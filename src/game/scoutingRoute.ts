export interface ScoutSite {
  id: string;
  travelMinutes: number;
  danger: number;
  rewardScore: number;
  discovered?: boolean;
}

export interface ScoutRoute {
  stops: ScoutSite[];
  totalMinutes: number;
  danger: number;
  rewardScore: number;
}

export function planScoutRoute(sites: ScoutSite[], maxMinutes: number, maxDanger: number): ScoutRoute {
  const candidates = sites
    .filter(site => !site.discovered && site.danger <= maxDanger)
    .sort((a, b) => (b.rewardScore / Math.max(1, b.travelMinutes)) - (a.rewardScore / Math.max(1, a.travelMinutes)));
  const stops: ScoutSite[] = [];
  let totalMinutes = 0;
  let danger = 0;
  let rewardScore = 0;
  for (const site of candidates) {
    if (totalMinutes + site.travelMinutes > maxMinutes) continue;
    if (danger + site.danger > maxDanger) continue;
    stops.push(site);
    totalMinutes += site.travelMinutes;
    danger += site.danger;
    rewardScore += site.rewardScore;
  }
  return { stops, totalMinutes, danger, rewardScore };
}
