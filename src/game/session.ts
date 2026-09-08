import type { ResourceId } from './resources';

type SessionResourceId = Exclude<ResourceId, 'population'>;

export interface PrototypeSessionState {
  resources: Record<SessionResourceId, number>;
  population: number;
  settlementProgress: number;
  power: number;
  completedUpgrades: string[];
  discoveredLocationIds: string[];
  ruinExposed: boolean;
  lastScoutReport?: string;
}

export const createPrototypeSession = (): PrototypeSessionState => ({
  resources: {
    food: 500,
    timber: 400,
    stone: 250,
    clay: 150,
    iron: 80,
  },
  population: 24,
  settlementProgress: 18,
  power: 18,
  completedUpgrades: [],
  discoveredLocationIds: ['home'],
  ruinExposed: false,
});

export const completePrototypeUpgrade = (
  state: PrototypeSessionState,
  upgradeId: string,
  timberCost = 40,
  stoneCost = 20,
): PrototypeSessionState => {
  if (state.completedUpgrades.includes(upgradeId)) return state;
  if (state.resources.timber < timberCost || state.resources.stone < stoneCost) return state;

  return {
    ...state,
    resources: {
      ...state.resources,
      timber: state.resources.timber - timberCost,
      stone: state.resources.stone - stoneCost,
    },
    settlementProgress: Math.min(100, state.settlementProgress + 12),
    power: state.power + 2,
    completedUpgrades: [...state.completedUpgrades, upgradeId],
  };
};

export const recordScoutDiscovery = (
  state: PrototypeSessionState,
  locationId: string,
  report: string,
  reward?: Partial<Record<SessionResourceId, number>>,
): PrototypeSessionState => {
  const alreadyDiscovered = state.discoveredLocationIds.includes(locationId);
  const resources = { ...state.resources };

  if (!alreadyDiscovered && reward) {
    (Object.keys(reward) as SessionResourceId[]).forEach((key) => {
      resources[key] += reward[key] ?? 0;
    });
  }

  return {
    ...state,
    resources,
    discoveredLocationIds: alreadyDiscovered
      ? state.discoveredLocationIds
      : [...state.discoveredLocationIds, locationId],
    lastScoutReport: report,
  };
};

export const exposePrototypeRuin = (state: PrototypeSessionState): PrototypeSessionState => {
  if (state.ruinExposed || state.settlementProgress < 55) return state;
  return {
    ...state,
    resources: { ...state.resources, iron: state.resources.iron + 15 },
    settlementProgress: Math.min(100, state.settlementProgress + 20),
    ruinExposed: true,
  };
};
