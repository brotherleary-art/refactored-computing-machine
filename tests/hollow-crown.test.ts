import { describe, expect, it } from 'vitest';
import { advanceHollowCrown, initialHollowCrownState } from '../src/game/hollowCrown';

describe('Hollow Crown expedition', () => {
  it('advances differently by approach and hero insight', () => {
    const start = initialHollowCrownState();
    const translated = advanceHollowCrown(start, 'translate', 36, 4);
    const forced = advanceHollowCrown(start, 'force', 12, 4);
    expect(translated.state.progress).toBeGreaterThan(18);
    expect(translated.state.resonance).toBeGreaterThan(0);
    expect(forced.state.danger).toBeGreaterThan(translated.state.danger);
  });

  it('recovers the ruin relic only after completion', () => {
    let state = initialHollowCrownState();
    for (let i = 0; i < 5 && !state.completed; i += 1) {
      state = advanceHollowCrown(state, 'resonate', 48, 4).state;
    }
    expect(state.completed).toBe(true);
    expect(state.relicRecovered).toBe(true);
  });

  it('rejects under-supplied expeditions', () => {
    expect(() => advanceHollowCrown(initialHollowCrownState(), 'translate', 20, 1)).toThrow();
  });
});
