import { describe, expect, it } from 'vitest';
import { claimExpeditionReward, resolveExpeditionStep, startExpedition } from '../src/game/ruinExpeditionSession.js';

describe('ruin expedition session', () => {
  it('persists progress, danger and supplies through completion', () => {
    let session = startExpedition('hollow-crown', 'sera', 5);
    session = resolveExpeditionStep(session, 45, 20, 2);
    expect(session).toMatchObject({ phase: 'active', progress: 45, danger: 20, supplies: 3 });
    session = resolveExpeditionStep(session, 55, 15, 2);
    expect(session.phase).toBe('completed');
    session = claimExpeditionReward(session);
    expect(session.rewardClaimed).toBe(true);
    expect(() => claimExpeditionReward(session)).toThrow(/already claimed/);
  });

  it('fails when supplies are insufficient', () => {
    const session = resolveExpeditionStep(startExpedition('sunken-watch', 'orin', 1), 20, 10, 2);
    expect(session.phase).toBe('failed');
  });
});
