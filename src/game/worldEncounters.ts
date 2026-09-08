import { applyLosses, BattleResult, BattleSide, resolveBattle } from './combat';
import { getHero } from './heroes';

export type WorldEncounterId = 'broken-pike-camp' | 'grey-banner-patrol';

export interface WorldEncounterDefinition {
  id: WorldEncounterId;
  name: string;
  danger: number;
  enemyName: string;
  enemyArmy: BattleSide['army'];
  enemyMorale: number;
  fortificationBonus?: number;
  rewards: { food?: number; timber?: number; stone?: number; clay?: number; iron?: number; power?: number };
}

export interface WorldEncounterState {
  id: WorldEncounterId;
  resolved: boolean;
  victory: boolean;
  rewardClaimed: boolean;
  playerArmy: BattleSide['army'];
  enemyArmy: BattleSide['army'];
  lastResult?: BattleResult;
}

export const WORLD_ENCOUNTERS: Record<WorldEncounterId, WorldEncounterDefinition> = {
  'broken-pike-camp': {
    id: 'broken-pike-camp',
    name: 'Broken Pike Camp',
    danger: 1,
    enemyName: 'Broken Pike Raiders',
    enemyArmy: [
      { unit: 'militia', count: 14 },
      { unit: 'archers', count: 5 },
    ],
    enemyMorale: 58,
    fortificationBonus: 0.03,
    rewards: { food: 30, timber: 20, iron: 8, power: 2 },
  },
  'grey-banner-patrol': {
    id: 'grey-banner-patrol',
    name: 'Grey Banner Patrol',
    danger: 2,
    enemyName: 'Grey Banner Patrol',
    enemyArmy: [
      { unit: 'militia', count: 14 },
      { unit: 'spearmen', count: 8 },
      { unit: 'archers', count: 6 },
    ],
    enemyMorale: 72,
    rewards: { food: 22, stone: 18, iron: 12, power: 3 },
  },
};

export const createWorldEncounter = (id: WorldEncounterId): WorldEncounterState => {
  const definition = WORLD_ENCOUNTERS[id];
  return {
    id,
    resolved: false,
    victory: false,
    rewardClaimed: false,
    playerArmy: [
      { unit: 'militia', count: 20 },
      { unit: 'spearmen', count: 10 },
      { unit: 'archers', count: 8 },
    ],
    enemyArmy: definition.enemyArmy.map((entry) => ({ ...entry })),
  };
};

export const resolveWorldEncounter = (
  state: WorldEncounterState,
  commanderId = 'sera-vale',
): WorldEncounterState => {
  if (state.resolved) return state;
  const definition = WORLD_ENCOUNTERS[state.id];
  const attacker: BattleSide = {
    name: 'Ashfall Field Force',
    commander: getHero(commanderId),
    army: state.playerArmy,
    morale: 74,
    terrainBonus: 0.02,
  };
  const defender: BattleSide = {
    name: definition.enemyName,
    army: state.enemyArmy,
    morale: definition.enemyMorale,
    fortificationBonus: definition.fortificationBonus,
  };
  const result = resolveBattle(attacker, defender);
  return {
    ...state,
    resolved: true,
    victory: result.winner === 'attacker',
    playerArmy: applyLosses(state.playerArmy, result.attackerLossRate),
    enemyArmy: applyLosses(state.enemyArmy, result.defenderLossRate),
    lastResult: result,
  };
};

export const claimWorldEncounterReward = (state: WorldEncounterState): WorldEncounterState => {
  if (!state.resolved || !state.victory || state.rewardClaimed) return state;
  return { ...state, rewardClaimed: true };
};
