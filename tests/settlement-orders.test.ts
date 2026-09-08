import { describe, expect, it } from 'vitest';
import { issueSettlementOrder } from '../src/game/settlementOrders';

const base = { minute: 100, population: 20, morale: 60, food: 20, timber: 10, orderCooldownUntil: 0 };

describe('issueSettlementOrder', () => {
  it('lets the player trade morale for emergency food through rationing', () => {
    const next = issueSettlementOrder(base, 'ration');
    expect(next.food).toBe(30);
    expect(next.morale).toBe(56);
    expect(next.orderCooldownUntil).toBe(130);
  });

  it('spends timber to send forage teams', () => {
    const next = issueSettlementOrder(base, 'forage');
    expect(next.food).toBe(36);
    expect(next.timber).toBe(8);
  });

  it('uses stored food to recover morale with a festival', () => {
    const next = issueSettlementOrder({ ...base, food: 50, morale: 94 }, 'festival');
    expect(next.food).toBe(20);
    expect(next.morale).toBe(100);
  });

  it('rejects orders while the cooldown is active', () => {
    expect(() => issueSettlementOrder({ ...base, orderCooldownUntil: 101 }, 'ration')).toThrow(/cooldown/);
  });
});
