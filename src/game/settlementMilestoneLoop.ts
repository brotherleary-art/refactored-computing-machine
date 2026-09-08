export type SettlementLoopState = {
  minute: number;
  population: number;
  morale: number;
  storageCap: number;
  resources: { food: number; timber: number; stone: number };
};

export type SettlementRates = {
  foodPerMinute: number;
  timberPerMinute: number;
  stonePerMinute: number;
  foodUpkeepPerPersonPerMinute: number;
};

export function advanceSettlementLoop(
  state: SettlementLoopState,
  rates: SettlementRates,
  minutes: number,
): SettlementLoopState {
  if (!Number.isInteger(minutes) || minutes < 0) throw new Error('minutes must be a non-negative integer');
  const foodDelta = rates.foodPerMinute * minutes - rates.foodUpkeepPerPersonPerMinute * state.population * minutes;
  const nextFood = state.resources.food + foodDelta;
  const shortage = Math.max(0, -nextFood);
  const clamp = (value: number) => Math.min(state.storageCap, Math.max(0, value));

  return {
    ...state,
    minute: state.minute + minutes,
    morale: Math.max(0, state.morale - Math.ceil(shortage / 10)),
    resources: {
      food: clamp(nextFood),
      timber: clamp(state.resources.timber + rates.timberPerMinute * minutes),
      stone: clamp(state.resources.stone + rates.stonePerMinute * minutes),
    },
  };
}
