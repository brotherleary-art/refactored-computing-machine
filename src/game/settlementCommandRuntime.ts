export type SettlementResource = 'food' | 'timber' | 'stone';

export interface SettlementCommandState {
  resources: Record<SettlementResource, number>;
  population: number;
  morale: number;
  elapsedMinutes: number;
}

export interface SettlementCommandInput {
  minutes: number;
  foodPerMinute: number;
  timberPerMinute: number;
  stonePerMinute: number;
  foodUpkeepPerPersonPerMinute?: number;
}

export function runSettlementCommand(
  state: SettlementCommandState,
  input: SettlementCommandInput,
): SettlementCommandState & { starving: boolean; summary: string } {
  if (input.minutes <= 0) throw new Error('minutes must be positive');
  const upkeepRate = input.foodUpkeepPerPersonPerMinute ?? 0.05;
  const upkeep = state.population * upkeepRate * input.minutes;
  const producedFood = Math.max(0, input.foodPerMinute) * input.minutes * state.morale;
  const nextFood = Math.max(0, state.resources.food - upkeep + producedFood);
  const starving = state.resources.food + producedFood < upkeep;
  const next = {
    resources: {
      food: nextFood,
      timber: state.resources.timber + Math.max(0, input.timberPerMinute) * input.minutes * state.morale,
      stone: state.resources.stone + Math.max(0, input.stonePerMinute) * input.minutes * state.morale,
    },
    population: state.population,
    morale: starving ? Math.max(0.25, state.morale - 0.1) : state.morale,
    elapsedMinutes: state.elapsedMinutes + input.minutes,
    starving,
    summary: starving ? 'Settlement turn complete: food shortage reduced morale.' : 'Settlement turn complete: stores increased and upkeep was paid.',
  };
  return next;
}
