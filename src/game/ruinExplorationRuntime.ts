export interface RuinSite {
  id: string;
  name: string;
  travelMinutes: number;
  danger: number;
  discovered: boolean;
}

export interface ExplorationState {
  siteId: string;
  status: 'traveling' | 'arrived' | 'entered' | 'failed';
  progressMinutes: number;
  supplies: number;
  dangerBudget: number;
}

export function beginExploration(site: RuinSite, supplies: number, dangerBudget: number): ExplorationState {
  if (!site.discovered) throw new Error('site not discovered');
  if (supplies <= 0) throw new Error('supplies required');
  if (dangerBudget < site.danger) throw new Error('danger exceeds party tolerance');
  return { siteId: site.id, status: 'traveling', progressMinutes: 0, supplies, dangerBudget };
}

export function advanceExploration(state: ExplorationState, site: RuinSite, minutes: number): ExplorationState {
  if (state.status !== 'traveling') return state;
  const supplyCost = Math.ceil(Math.max(0, minutes) / 10);
  if (state.supplies < supplyCost) return { ...state, status: 'failed', supplies: 0 };
  const progressMinutes = state.progressMinutes + Math.max(0, minutes);
  return {
    ...state,
    progressMinutes,
    supplies: state.supplies - supplyCost,
    status: progressMinutes >= site.travelMinutes ? 'arrived' : 'traveling',
  };
}

export function enterRuin(state: ExplorationState): ExplorationState {
  if (state.status !== 'arrived') throw new Error('party has not arrived');
  return { ...state, status: 'entered' };
}
