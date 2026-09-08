export type SettlementUpkeepState = {
  food: number;
  population: number;
  morale: number;
  starvationHours?: number;
};

export function applySettlementUpkeep(state: SettlementUpkeepState, elapsedHours: number): Required<SettlementUpkeepState> {
  if (!Number.isFinite(elapsedHours) || elapsedHours < 0) throw new Error('elapsedHours must be non-negative');
  const population = Math.max(0, Math.floor(state.population));
  const food = Math.max(0, state.food);
  const demand = population * 0.5 * elapsedHours;
  const consumed = Math.min(food, demand);
  const deficit = Math.max(0, demand - consumed);
  const demandPerHour = population * 0.5;
  const starvationHours = demandPerHour > 0 ? deficit / demandPerHour : 0;
  const populationLoss = starvationHours > 0 ? Math.ceil(starvationHours * Math.max(1, population * 0.05)) : 0;
  const moraleLoss = starvationHours > 0 ? Math.ceil(starvationHours * 8) : 0;

  return {
    food: Math.max(0, Math.round((food - consumed) * 100) / 100),
    population: Math.max(0, population - populationLoss),
    morale: Math.max(0, Math.min(100, state.morale - moraleLoss)),
    starvationHours: Math.round(starvationHours * 100) / 100,
  };
}
