export type CinderObjectiveId = 'secure-gate' | 'survey-blackglass' | 'break-cinder-host' | 'open-hollow-crown';

export interface CinderValeState {
  gateSecured: boolean;
  blackglassSurveyed: boolean;
  cinderHostDefeated: boolean;
  hollowCrownOpened: boolean;
}

export interface CinderValeProgress {
  completed: CinderObjectiveId[];
  current: CinderObjectiveId | null;
  percent: number;
}

const ORDER: Array<[CinderObjectiveId, keyof CinderValeState]> = [
  ['secure-gate', 'gateSecured'],
  ['survey-blackglass', 'blackglassSurveyed'],
  ['break-cinder-host', 'cinderHostDefeated'],
  ['open-hollow-crown', 'hollowCrownOpened'],
];

export function cinderValeProgress(state: CinderValeState): CinderValeProgress {
  const completed = ORDER.filter(([, key]) => state[key]).map(([id]) => id);
  const current = ORDER.find(([, key]) => !state[key])?.[0] ?? null;
  return { completed, current, percent: completed.length * 25 };
}
