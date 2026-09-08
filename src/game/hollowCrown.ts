export type CrownApproach = 'translate' | 'force' | 'resonate';

export interface HollowCrownState {
  progress: number;
  resonance: number;
  danger: number;
  completed: boolean;
  relicRecovered: boolean;
}

export interface HollowCrownResult {
  state: HollowCrownState;
  suppliesSpent: number;
  injuryRisk: number;
}

const gains: Record<CrownApproach, { progress: number; resonance: number; danger: number }> = {
  translate: { progress: 18, resonance: 6, danger: 4 },
  force: { progress: 28, resonance: 0, danger: 15 },
  resonate: { progress: 22, resonance: 14, danger: 9 },
};

export function advanceHollowCrown(state: HollowCrownState, approach: CrownApproach, heroInsight: number, supplies: number): HollowCrownResult {
  if (state.completed) return { state, suppliesSpent: 0, injuryRisk: 0 };
  if (supplies < 2) throw new Error('At least 2 expedition supplies are required');
  const base = gains[approach];
  const insightBonus = Math.max(0, Math.floor(heroInsight / 12));
  const progress = Math.min(100, state.progress + base.progress + insightBonus);
  const danger = Math.min(100, state.danger + Math.max(0, base.danger - Math.floor(heroInsight / 10)));
  const resonance = Math.min(100, state.resonance + base.resonance);
  const completed = progress >= 100;
  return {
    state: { progress, danger, resonance, completed, relicRecovered: state.relicRecovered || completed },
    suppliesSpent: approach === 'force' ? 4 : 2,
    injuryRisk: Math.max(0, danger - heroInsight),
  };
}

export function initialHollowCrownState(): HollowCrownState {
  return { progress: 0, resonance: 0, danger: 12, completed: false, relicRecovered: false };
}
