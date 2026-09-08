export type OrdinaryRuinId = 'ruin-1' | 'ruin-2' | 'ruin-3';
export type RuinChoice = 'study' | 'salvage' | 'press-on';

export interface OrdinaryRuinDefinition {
  id: OrdinaryRuinId;
  name: string;
  danger: number;
  reward: { resource: 'food' | 'timber' | 'stone' | 'clay' | 'iron'; amount: number; knowledge: number };
}

export interface OrdinaryRuinRun {
  ruinId: OrdinaryRuinId;
  supplies: number;
  danger: number;
  progress: number;
  completed: boolean;
  rewardClaimed: boolean;
  log: string[];
}

export const ORDINARY_RUINS: Record<OrdinaryRuinId, OrdinaryRuinDefinition> = {
  'ruin-1': { id: 'ruin-1', name: 'The Sunken Watch', danger: 1, reward: { resource: 'stone', amount: 28, knowledge: 2 } },
  'ruin-2': { id: 'ruin-2', name: 'Vault of Quiet Iron', danger: 3, reward: { resource: 'iron', amount: 22, knowledge: 4 } },
  'ruin-3': { id: 'ruin-3', name: 'Glassroot Chamber', danger: 2, reward: { resource: 'clay', amount: 35, knowledge: 3 } },
};

const heroBias: Record<string, { study: number; salvage: number; press: number }> = {
  'Sera Vale': { study: 4, salvage: 5, press: 12 },
  'Orin Thess': { study: 8, salvage: 7, press: 8 },
  'Mara Keln': { study: 7, salvage: 13, press: 6 },
  'Ilya Ren': { study: 16, salvage: 6, press: 4 },
};

export const createRuinRun = (ruinId: OrdinaryRuinId): OrdinaryRuinRun => ({
  ruinId,
  supplies: 4,
  danger: ORDINARY_RUINS[ruinId].danger * 10,
  progress: 0,
  completed: false,
  rewardClaimed: false,
  log: [],
});

export const resolveRuinStep = (run: OrdinaryRuinRun, heroName: string, choice: RuinChoice): OrdinaryRuinRun => {
  if (run.completed || run.supplies <= 0) return run;
  const bias = heroBias[heroName] ?? heroBias['Orin Thess'];
  const gain = choice === 'study' ? 25 + bias.study : choice === 'salvage' ? 24 + bias.salvage : 31 + bias.press;
  const dangerDelta = choice === 'study' ? -4 : choice === 'salvage' ? 2 : 7;
  const progress = Math.min(100, run.progress + gain);
  const completed = progress >= 100;
  return {
    ...run,
    supplies: run.supplies - 1,
    danger: Math.max(0, run.danger + dangerDelta),
    progress,
    completed,
    rewardClaimed: completed ? true : run.rewardClaimed,
    log: [...run.log, `${heroName} chose ${choice}; ruin progress reached ${progress}%.`],
  };
};
