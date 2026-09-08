import { describe, expect, it } from 'vitest';
import { RESEARCH_NODES, canResearch, completeResearch } from '../src/game/research';
import { UNIT_TYPES, canTrainUnit, trainUnit } from '../src/game/units';
import { createAlliance, joinAlliance, leaveAlliance } from '../src/game/alliance';
import { evaluateProtectedPvp } from '../src/game/pvpProtection';

describe('vertical slice research tree', () => {
  it('contains a connected starter tree and enforces prerequisites', () => {
    expect(RESEARCH_NODES.length).toBeGreaterThanOrEqual(6);
    expect(canResearch('field_rotation', [], 50)).toBe(true);
    expect(canResearch('reinforced_masonry', [], 500)).toBe(false);
  });

  it('spends knowledge and records completion once', () => {
    const result = completeResearch('field_rotation', [], 100);
    expect(result.completed).toContain('field_rotation');
    expect(result.knowledge).toBeLessThan(100);
    expect(() => completeResearch('field_rotation', result.completed, result.knowledge)).toThrow();
  });
});

describe('six-unit training roster', () => {
  it('ships exactly six vertical-slice unit types', () => {
    expect(UNIT_TYPES).toHaveLength(6);
    expect(new Set(UNIT_TYPES.map((unit) => unit.id)).size).toBe(6);
  });

  it('validates requirements and spends resources when training', () => {
    const wallet = { food: 500, timber: 500, stone: 500, clay: 500, iron: 500 };
    expect(canTrainUnit('militia', wallet, ['barracks'])).toBe(true);
    const result = trainUnit('militia', 5, wallet, ['barracks']);
    expect(result.units).toBe(5);
    expect(result.wallet.food).toBeLessThan(wallet.food);
  });
});

describe('alliance scaffold', () => {
  it('creates, joins, and leaves a capped alliance without duplicate members', () => {
    const created = createAlliance('Ashfall Pact', 'player-1');
    const joined = joinAlliance(created, 'player-2');
    expect(joined.members).toEqual(['player-1', 'player-2']);
    expect(joinAlliance(joined, 'player-2').members).toEqual(joined.members);
    expect(leaveAlliance(joined, 'player-2').members).toEqual(['player-1']);
  });
});

describe('protected PvP rules', () => {
  it('blocks attacks on protected players and allows eligible rival raids', () => {
    expect(evaluateProtectedPvp({ attackerPower: 100, defenderPower: 90, defenderShielded: true, sameAlliance: false, defenderOfflineMinutes: 10 }).allowed).toBe(false);
    expect(evaluateProtectedPvp({ attackerPower: 100, defenderPower: 90, defenderShielded: false, sameAlliance: false, defenderOfflineMinutes: 10 }).allowed).toBe(true);
  });

  it('blocks same-alliance attacks and extreme power mismatches', () => {
    expect(evaluateProtectedPvp({ attackerPower: 100, defenderPower: 100, defenderShielded: false, sameAlliance: true, defenderOfflineMinutes: 0 }).allowed).toBe(false);
    expect(evaluateProtectedPvp({ attackerPower: 500, defenderPower: 50, defenderShielded: false, sameAlliance: false, defenderOfflineMinutes: 0 }).allowed).toBe(false);
  });
});
