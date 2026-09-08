export type ExpeditionChoiceId = 'listen' | 'force-door' | 'trace-signal';

export interface ExpeditionHero {
  name: string;
  command: number;
  scouting: number;
  knowledge: number;
  engineering: number;
  resonance: number;
}

export interface RuinExpeditionState {
  ruinId: string;
  supplies: number;
  danger: number;
  progress: number;
  resonance: number;
  completed: boolean;
  recoveredRelics: string[];
  log: string[];
}

export interface ExpeditionOutcome {
  state: RuinExpeditionState;
  message: string;
  resourceReward?: Partial<Record<'food' | 'timber' | 'stone' | 'clay' | 'iron', number>>;
}

export const createBuriedMeridianExpedition = (): RuinExpeditionState => ({
  ruinId: 'buried-meridian',
  supplies: 3,
  danger: 18,
  progress: 0,
  resonance: 0,
  completed: false,
  recoveredRelics: [],
  log: ['The expedition descends beneath Ashfall Hold. The walls have no visible seams.'],
});

const clone = (state: RuinExpeditionState): RuinExpeditionState => ({
  ...state,
  recoveredRelics: [...state.recoveredRelics],
  log: [...state.log],
});

export const resolveBuriedMeridianChoice = (
  current: RuinExpeditionState,
  choice: ExpeditionChoiceId,
  hero: ExpeditionHero,
): ExpeditionOutcome => {
  if (current.completed) return { state: current, message: 'The Buried Meridian expedition is already complete.' };
  if (current.supplies <= 0) return { state: current, message: 'The expedition has no supplies left and must withdraw.' };

  const state = clone(current);
  state.supplies -= 1;

  if (choice === 'listen') {
    const gain = 14 + hero.knowledge * 2 + hero.resonance * 3;
    state.progress = Math.min(100, state.progress + gain);
    state.resonance += 8 + hero.resonance * 2;
    state.danger = Math.max(0, state.danger - Math.max(2, hero.knowledge));
    state.log.push(`${hero.name} studies the chamber's pulse instead of disturbing it.`);
  }

  if (choice === 'force-door') {
    const gain = 20 + hero.command + hero.engineering * 2;
    state.progress = Math.min(100, state.progress + gain);
    state.danger += Math.max(3, 12 - hero.engineering);
    state.log.push(`${hero.name} commits the expedition to opening the sealed threshold by force.`);
  }

  if (choice === 'trace-signal') {
    const gain = 18 + hero.scouting * 2 + hero.resonance * 2;
    state.progress = Math.min(100, state.progress + gain);
    state.resonance += 12 + hero.resonance;
    state.danger += Math.max(1, 7 - hero.scouting);
    state.log.push(`${hero.name} follows the impossible signal deeper beneath the hold.`);
  }

  let resourceReward: ExpeditionOutcome['resourceReward'];
  if (state.progress >= 100) {
    state.completed = true;
    const relic = 'Meridian Lens';
    if (!state.recoveredRelics.includes(relic)) state.recoveredRelics.push(relic);
    resourceReward = { iron: 25, stone: 40 };
    state.log.push('A dormant mechanism answers. For one heartbeat, another world appears beyond the chamber.');
  }

  return {
    state,
    resourceReward,
    message: state.completed
      ? 'The Buried Meridian is breached. The Meridian Lens has been recovered.'
      : `Expedition progress ${state.progress}%. Danger ${state.danger}. Supplies ${state.supplies}.`,
  };
};
