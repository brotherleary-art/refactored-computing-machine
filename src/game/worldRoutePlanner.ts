export type WorldNode = { id: string; travelCost: number; discovered: boolean; ruinId?: string };
export type ExpeditionParty = { supplies: number; visited: string[]; discoveredRuins: string[] };

export function travelToNode(party: ExpeditionParty, node: WorldNode): ExpeditionParty {
  if (!node.discovered) throw new Error('world node is not discovered');
  if (node.travelCost <= 0) throw new Error('travel cost must be positive');
  if (party.supplies < node.travelCost) throw new Error('insufficient supplies');
  return {
    supplies: party.supplies - node.travelCost,
    visited: [...new Set([...party.visited, node.id])],
    discoveredRuins: node.ruinId ? [...new Set([...party.discoveredRuins, node.ruinId])] : party.discoveredRuins,
  };
}

export function revealAdjacent(nodes: WorldNode[], reachableIds: string[]): WorldNode[] {
  const reachable = new Set(reachableIds);
  return nodes.map((node) => reachable.has(node.id) ? { ...node, discovered: true } : node);
}
