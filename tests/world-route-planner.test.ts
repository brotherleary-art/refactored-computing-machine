import { describe, expect, it } from 'vitest';
import { revealAdjacent, travelToNode } from '../src/game/worldRoutePlanner';

describe('world route planner', () => {
  it('reveals reachable map nodes and records discovered ruins', () => {
    const nodes = [
      { id: 'ashfall', travelCost: 1, discovered: true },
      { id: 'blackglass', travelCost: 4, discovered: false, ruinId: 'hollow-crown' },
    ];
    const revealed = revealAdjacent(nodes, ['blackglass']);
    const party = travelToNode({ supplies: 7, visited: [], discoveredRuins: [] }, revealed[1]);
    expect(party.supplies).toBe(3);
    expect(party.visited).toContain('blackglass');
    expect(party.discoveredRuins).toContain('hollow-crown');
  });

  it('blocks hidden destinations and under-supplied travel', () => {
    const hidden = { id: 'rift', travelCost: 5, discovered: false };
    expect(() => travelToNode({ supplies: 9, visited: [], discoveredRuins: [] }, hidden)).toThrow();
    expect(() => travelToNode({ supplies: 2, visited: [], discoveredRuins: [] }, { ...hidden, discovered: true })).toThrow();
  });
});
