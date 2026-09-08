import { ResourceWallet, createStartingWallet } from './resources';
import { Hero, STARTING_HEROES } from './heroes';
import { ExplorationState } from './world';

export interface BuildingStateSnapshot {
  id: string;
  level: number;
  completesAt?: number;
}

export interface GameSave {
  version: 1;
  savedAt: number;
  settlementName: string;
  wallet: ResourceWallet;
  buildings: BuildingStateSnapshot[];
  heroes: Hero[];
  exploration: ExplorationState;
  unlockedGates: string[];
}

export const createNewSave = (): GameSave => ({
  version: 1,
  savedAt: Date.now(),
  settlementName: 'Ashfall Hold',
  wallet: createStartingWallet(),
  buildings: [{ id: 'town-hall', level: 1 }],
  heroes: STARTING_HEROES.map((hero) => ({ ...hero, stats: { ...hero.stats } })),
  exploration: { discoveredLocationIds: ['home'] },
  unlockedGates: [],
});

export const serializeSave = (save: GameSave): string =>
  JSON.stringify({ ...save, savedAt: Date.now() });

const isFiniteNonNegative = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

export const parseSave = (raw: string): GameSave => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('SAVE_INVALID_JSON');
  }

  if (!parsed || typeof parsed !== 'object') throw new Error('SAVE_INVALID_SHAPE');
  const save = parsed as Partial<GameSave>;
  if (save.version !== 1) throw new Error('SAVE_VERSION_UNSUPPORTED');
  if (typeof save.settlementName !== 'string' || save.settlementName.length < 1) throw new Error('SAVE_INVALID_SETTLEMENT');
  if (!save.wallet || typeof save.wallet !== 'object') throw new Error('SAVE_INVALID_WALLET');

  for (const key of ['food', 'timber', 'stone', 'clay', 'iron', 'population'] as const) {
    if (!isFiniteNonNegative(save.wallet[key])) throw new Error(`SAVE_INVALID_RESOURCE_${key.toUpperCase()}`);
  }

  if (!Array.isArray(save.buildings) || !Array.isArray(save.heroes)) throw new Error('SAVE_INVALID_COLLECTIONS');
  if (!save.exploration || !Array.isArray(save.exploration.discoveredLocationIds)) throw new Error('SAVE_INVALID_EXPLORATION');
  if (!Array.isArray(save.unlockedGates)) throw new Error('SAVE_INVALID_GATES');

  return save as GameSave;
};

export const autosaveKey = (playerId: string): string => `shattered-ages:save:v1:${playerId}`;

export const saveToStorage = (storage: Pick<Storage, 'setItem'>, playerId: string, save: GameSave): void => {
  storage.setItem(autosaveKey(playerId), serializeSave(save));
};

export const loadFromStorage = (storage: Pick<Storage, 'getItem'>, playerId: string): GameSave | null => {
  const raw = storage.getItem(autosaveKey(playerId));
  return raw ? parseSave(raw) : null;
};
