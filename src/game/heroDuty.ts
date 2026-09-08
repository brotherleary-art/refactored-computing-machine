export type HeroAssignment = 'idle' | 'scouting' | 'construction' | 'ruin' | 'combat' | 'recovering';

export interface HeroDutyState {
  heroId: string;
  assignment: HeroAssignment;
  woundedUntil?: number;
}

export interface HeroDutyCheck {
  available: boolean;
  reason: string | null;
}

export function heroDutyAvailability(state: HeroDutyState, now: number): HeroDutyCheck {
  if ((state.woundedUntil ?? 0) > now) return { available: false, reason: 'HERO_RECOVERING' };
  if (state.assignment !== 'idle' && state.assignment !== 'recovering') return { available: false, reason: 'HERO_ALREADY_ASSIGNED' };
  return { available: true, reason: null };
}

export function assignHero(state: HeroDutyState, assignment: Exclude<HeroAssignment,'idle'|'recovering'>, now: number): HeroDutyState {
  const check=heroDutyAvailability(state,now);
  if(!check.available) throw new Error(check.reason ?? 'HERO_UNAVAILABLE');
  return {...state,assignment};
}

export function releaseHero(state: HeroDutyState, now: number): HeroDutyState {
  if((state.woundedUntil ?? 0)>now) return {...state,assignment:'recovering'};
  return {...state,assignment:'idle',woundedUntil:undefined};
}
