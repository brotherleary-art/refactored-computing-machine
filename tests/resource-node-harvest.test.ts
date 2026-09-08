import { describe, expect, it } from 'vitest';
import { createStartingWallet } from '../src/game/resources';
import { harvestResourceNode } from '../src/game/resourceNodeHarvest';

describe('resource node harvesting', () => {
  it('harvests into storage and depletes the node', () => {
    const wallet = createStartingWallet();
    const node = { id: 'ridge-iron', resource: 'iron' as const, remaining: 50, yieldPerWorker: 4, cooldownSeconds: 60 };
    const result = harvestResourceNode(node, wallet, 3, 1_000, 100);
    expect(result.gathered).toBe(12);
    expect(result.wallet.iron).toBe(92);
    expect(result.node.remaining).toBe(38);
    expect(result.nextAvailableAt).toBe(61_000);
  });

  it('respects storage capacity and cooldown', () => {
    const wallet = { ...createStartingWallet(), timber: 995 };
    const node = { id: 'northwood', resource: 'timber' as const, remaining: 90, yieldPerWorker: 10, cooldownSeconds: 30, lastHarvestedAt: 1_000 };
    expect(() => harvestResourceNode(node, wallet, 2, 20_000, 1_000)).toThrow('NODE_COOLDOWN');
    const result = harvestResourceNode(node, wallet, 2, 31_000, 1_000);
    expect(result.gathered).toBe(5);
    expect(result.wallet.timber).toBe(1_000);
  });
});
