export interface ConstructionCancelOrder {
  id: string;
  startedAt: number;
  completesAt: number;
  cost: { timber: number; stone: number };
}

export interface ConstructionCancelInput {
  now: number;
  wallet: { timber: number; stone: number };
  order: ConstructionCancelOrder;
}

export function cancelConstruction(input: ConstructionCancelInput) {
  const { now, wallet, order } = input;
  if (now >= order.completesAt) {
    return { cancelled: false as const, reason: 'already-complete' as const, wallet: { ...wallet }, refund: { timber: 0, stone: 0 } };
  }

  const duration = Math.max(1, order.completesAt - order.startedAt);
  const elapsed = Math.max(0, now - order.startedAt);
  const progress = Math.min(1, elapsed / duration);
  const refundRate = progress < 0.5 ? 0.75 : 0.25;
  const refund = {
    timber: Math.floor(Math.max(0, order.cost.timber) * refundRate),
    stone: Math.floor(Math.max(0, order.cost.stone) * refundRate),
  };

  return {
    cancelled: true as const,
    reason: 'cancelled' as const,
    refund,
    wallet: { timber: wallet.timber + refund.timber, stone: wallet.stone + refund.stone },
  };
}
