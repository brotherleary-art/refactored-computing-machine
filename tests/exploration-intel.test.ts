import { describe, expect, it } from 'vitest';
import { surveyLocation, decayIntel } from '../src/game/explorationIntel';

describe('exploration intel', () => {
  it('reveals a ruin only when accumulated intel reaches its threshold', () => {
    const first = surveyLocation({ intel: 20, revealThreshold: 60, revealed: false }, 25);
    expect(first.revealed).toBe(false);
    const second = surveyLocation(first, 20);
    expect(second.revealed).toBe(true);
    expect(second.intel).toBe(65);
  });

  it('decays stale intel without hiding a location that was already revealed', () => {
    const stale = decayIntel({ intel: 80, revealThreshold: 60, revealed: true }, 72);
    expect(stale.intel).toBeLessThan(80);
    expect(stale.revealed).toBe(true);
  });
});
