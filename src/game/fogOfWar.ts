export type DiscoveryState = 'hidden' | 'scouted' | 'cleared';
export type DiscoveryMap = Record<string, DiscoveryState>;

const rank: Record<DiscoveryState, number> = { hidden: 0, scouted: 1, cleared: 2 };

export const updateDiscovery = (
  current: DiscoveryMap,
  observations: Partial<DiscoveryMap>,
): DiscoveryMap => {
  const next: DiscoveryMap = { ...current };
  for (const [nodeId, state] of Object.entries(observations)) {
    if (!state) continue;
    const existing = next[nodeId] ?? 'hidden';
    if (rank[state] > rank[existing]) next[nodeId] = state;
  }
  return next;
};

export const discoveryPercent = (discovery: DiscoveryMap): number => {
  const states = Object.values(discovery);
  if (!states.length) return 0;
  const discovered = states.filter((state) => state !== 'hidden').length;
  return Math.round((discovered / states.length) * 100);
};
