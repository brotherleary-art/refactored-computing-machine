export type SettlementOrder = 'ration' | 'forage' | 'festival';

export type SettlementOrderState = {
  minute: number;
  population: number;
  morale: number;
  food: number;
  timber: number;
  orderCooldownUntil: number;
};

export type SettlementOrderResult = SettlementOrderState & {
  order: SettlementOrder;
  note: string;
};

export function issueSettlementOrder(
  state: SettlementOrderState,
  order: SettlementOrder,
): SettlementOrderResult {
  if (state.minute < state.orderCooldownUntil) {
    throw new Error('settlement order is still on cooldown');
  }

  if (order === 'ration') {
    return {
      ...state,
      food: state.food + Math.max(1, Math.floor(state.population * 0.5)),
      morale: Math.max(0, state.morale - 4),
      orderCooldownUntil: state.minute + 30,
      order,
      note: 'Rations stretched at the cost of morale.',
    };
  }

  if (order === 'forage') {
    const timberCost = Math.max(2, Math.ceil(state.population / 10));
    if (state.timber < timberCost) throw new Error('not enough timber for forage teams');
    return {
      ...state,
      timber: state.timber - timberCost,
      food: state.food + Math.max(4, Math.floor(state.population * 0.8)),
      orderCooldownUntil: state.minute + 45,
      order,
      note: 'Forage teams returned with emergency food.',
    };
  }

  const feastCost = Math.max(10, Math.ceil(state.population * 1.5));
  if (state.food < feastCost) throw new Error('not enough food for a festival');
  return {
    ...state,
    food: state.food - feastCost,
    morale: Math.min(100, state.morale + 12),
    orderCooldownUntil: state.minute + 60,
    order,
    note: 'A settlement festival restored morale.',
  };
}
