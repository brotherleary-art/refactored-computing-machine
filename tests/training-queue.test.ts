import { describe, expect, it } from 'vitest';
import { createTrainingQueue, queueTraining, completeReadyTraining } from '../src/game/trainingQueue.js';
import type { ResourceWallet } from '../src/game/units.js';

const wallet = (): ResourceWallet => ({ food: 100, timber: 100, stone: 100, clay: 100, iron: 100 });

describe('training queue', () => {
  it('requires the unit building before training can be queued', () => {
    const queue = createTrainingQueue();
    expect(() => queueTraining(queue, 'archer', 1, wallet(), [], 1_000)).toThrow(/Cannot train/);
  });

  it('spends resources immediately and delays roster delivery until ready', () => {
    const queue = createTrainingQueue();
    const queued = queueTraining(queue, 'archer', 2, wallet(), ['barracks'], 1_000);
    expect(queued.wallet).toEqual({ food: 80, timber: 84, stone: 100, clay: 100, iron: 96 });
    expect(queued.queue).toHaveLength(1);
    expect(queued.queue[0].readyAt).toBeGreaterThan(1_000);

    const early = completeReadyTraining(queued.queue, {}, queued.queue[0].readyAt - 1);
    expect(early.roster.archer ?? 0).toBe(0);
    expect(early.queue).toHaveLength(1);

    const complete = completeReadyTraining(queued.queue, {}, queued.queue[0].readyAt);
    expect(complete.roster.archer).toBe(2);
    expect(complete.queue).toHaveLength(0);
  });

  it('uses longer training time for advanced units', () => {
    const militia = queueTraining(createTrainingQueue(), 'militia', 1, wallet(), ['barracks'], 5_000).queue[0];
    const warden = queueTraining(createTrainingQueue(), 'warden', 1, wallet(), ['forge'], 5_000).queue[0];
    expect(warden.readyAt - 5_000).toBeGreaterThan(militia.readyAt - 5_000);
  });
});
