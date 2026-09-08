import type { ResourceId, ResourceWallet } from './resources';

export interface ResourceNode {
  id: string;
  resource: Exclude<ResourceId, 'population'>;
  remaining: number;
  yieldPerWorker: number;
  cooldownSeconds: number;
  lastHarvestedAt?: number;
}

export interface HarvestResult {
  node: ResourceNode;
  wallet: ResourceWallet;
  gathered: number;
  nextAvailableAt: number;
}

export function harvestResourceNode(
  node: ResourceNode,
  wallet: ResourceWallet,
  workers: number,
  now: number,
  storageCap: number,
): HarvestResult {
  if (!Number.isInteger(workers) || workers < 1) throw new Error('INVALID_WORKER_COUNT');
  if (node.remaining <= 0) throw new Error('NODE_DEPLETED');
  const nextAvailableAt = (node.lastHarvestedAt ?? -Infinity) + node.cooldownSeconds * 1000;
  if (now < nextAvailableAt) throw new Error('NODE_COOLDOWN');

  const freeStorage = Math.max(0, storageCap - wallet[node.resource]);
  if (freeStorage <= 0) throw new Error('STORAGE_FULL');

  const gathered = Math.min(node.remaining, workers * node.yieldPerWorker, freeStorage);
  const nextNode = { ...node, remaining: node.remaining - gathered, lastHarvestedAt: now };
  const nextWallet = { ...wallet, [node.resource]: wallet[node.resource] + gathered };
  return { node: nextNode, wallet: nextWallet, gathered, nextAvailableAt: now + node.cooldownSeconds * 1000 };
}
