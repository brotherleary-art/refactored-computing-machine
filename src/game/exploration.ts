import { ResourceWallet } from './resources';
import { STARTING_REGION_LOCATIONS, WorldLocation } from './world';
import { Hero } from './heroes';

export interface ExpeditionParty {
  hero: Hero;
  supplies: number;
  soldiers: number;
}

export interface ExpeditionResult {
  locationId: string;
  success: boolean;
  discoveryProgress: number;
  suppliesSpent: number;
  rewards: Partial<ResourceWallet>;
  note: string;
}

const distance = (a: WorldLocation, b: WorldLocation): number =>
  Math.hypot(a.x - b.x, a.y - b.y);

export const travelMinutesFromHome = (locationId: string): number => {
  const home = STARTING_REGION_LOCATIONS.find((location) => location.id === 'home');
  const target = STARTING_REGION_LOCATIONS.find((location) => location.id === locationId);
  if (!home || !target) throw new Error('LOCATION_NOT_FOUND');
  return Math.max(1, Math.round(distance(home, target) * 0.8));
};

export const canEnterLocation = (location: WorldLocation, unlockedGates: string[]): boolean =>
  !location.storyGate || unlockedGates.includes(location.storyGate);

export const runExpedition = (
  locationId: string,
  party: ExpeditionParty,
  unlockedGates: string[] = [],
): ExpeditionResult => {
  const location = STARTING_REGION_LOCATIONS.find((candidate) => candidate.id === locationId);
  if (!location) throw new Error('LOCATION_NOT_FOUND');
  if (!canEnterLocation(location, unlockedGates)) throw new Error('STORY_GATE_LOCKED');

  const travel = travelMinutesFromHome(locationId);
  const suppliesNeeded = Math.max(2, Math.ceil(travel / 5) + location.danger * 2);
  if (party.supplies < suppliesNeeded) throw new Error('INSUFFICIENT_SUPPLIES');

  const skill = party.hero.stats.scouting + party.hero.stats.knowledge + party.hero.stats.resonance;
  const force = Math.min(12, Math.floor(party.soldiers / 5));
  const challenge = 8 + location.danger * 5;
  const success = skill + force >= challenge;
  const scholarBonus = party.hero.role === 'scholar' && location.type === 'ruin' ? 20 : 0;
  const discoveryProgress = success ? Math.min(100, 35 + skill * 3 + scholarBonus) : Math.max(5, skill * 2);

  const rewards: Partial<ResourceWallet> = {};
  if (success && location.resource) rewards[location.resource] = 60 + location.danger * 35;
  if (success && location.type === 'ruin') rewards.iron = 15 + location.danger * 10;

  return {
    locationId,
    success,
    discoveryProgress,
    suppliesSpent: suppliesNeeded,
    rewards,
    note: success
      ? `Expedition secured ${location.name} and returned with usable findings.`
      : `Expedition withdrew from ${location.name}; the route is now better understood.`,
  };
};
