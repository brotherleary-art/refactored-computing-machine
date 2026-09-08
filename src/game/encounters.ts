import { applyLosses, BattleResult, BattleSide, resolveBattle } from './combat';
import { getHero } from './heroes';

export type EncounterId = 'meridian-guardian';

export interface EncounterState {
  id: EncounterId;
  resolved: boolean;
  victory: boolean;
  rewardClaimed: boolean;
  playerArmy: BattleSide['army'];
  enemyArmy: BattleSide['army'];
  lastResult?: BattleResult;
}

export const createMeridianGuardianEncounter = (): EncounterState => ({
  id: 'meridian-guardian',
  resolved: false,
  victory: false,
  rewardClaimed: false,
  playerArmy: [
    { unit: 'militia', count: 24 },
    { unit: 'spearmen', count: 12 },
    { unit: 'archers', count: 10 },
  ],
  enemyArmy: [
    { unit: 'militia', count: 18 },
    { unit: 'spearmen', count: 8 },
  ],
});

export const resolveMeridianGuardian = (
  state: EncounterState,
  commanderId = 'sera-vale',
): EncounterState => {
  if (state.resolved) return state;

  const attacker: BattleSide = {
    name: 'Ashfall Expedition',
    commander: getHero(commanderId),
    army: state.playerArmy,
    morale: 78,
    terrainBonus: 0.05,
  };
  const defender: BattleSide = {
    name: 'Meridian Guardian',
    army: state.enemyArmy,
    morale: 68,
    fortificationBonus: 0.08,
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

export const claimEncounterReward = (state: EncounterState): EncounterState => {
  if (!state.resolved || !state.victory || state.rewardClaimed) return state;
  return { ...state, rewardClaimed: true };
};
