export type InjurySeverity = 'light' | 'serious' | 'critical';

export interface HeroRecoveryState {
  heroId: string;
  injury: InjurySeverity | null;
  woundedAt: number | null;
  recoveryReadyAt: number | null;
}

const RECOVERY_SECONDS: Record<InjurySeverity, number> = {
  light: 30,
  serious: 90,
  critical: 180,
};

export const createHeroRecoveryState = (heroId: string): HeroRecoveryState => ({
  heroId,
  injury: null,
  woundedAt: null,
  recoveryReadyAt: null,
});

export const woundHero = (state: HeroRecoveryState, severity: InjurySeverity, now: number, infirmaryLevel = 0): HeroRecoveryState => {
  const speedBonus = Math.min(0.5, Math.max(0, infirmaryLevel) * 0.1);
  const duration = Math.ceil(RECOVERY_SECONDS[severity] * (1 - speedBonus)) * 1000;
  return { ...state, injury: severity, woundedAt: now, recoveryReadyAt: now + duration };
};

export const isHeroAvailable = (state: HeroRecoveryState, now: number): boolean =>
  state.injury === null || (state.recoveryReadyAt !== null && now >= state.recoveryReadyAt);

export const recoverHero = (state: HeroRecoveryState, now: number): HeroRecoveryState => {
  if (!isHeroAvailable(state, now)) return state;
  return { ...state, injury: null, woundedAt: null, recoveryReadyAt: null };
};
