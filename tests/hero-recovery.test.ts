import { describe, expect, it } from 'vitest';
import { createHeroRecoveryState, isHeroAvailable, recoverHero, woundHero } from '../src/game/heroRecovery.js';

describe('hero recovery', () => {
  it('makes wounded heroes unavailable until recovery completes', () => {
    const wounded = woundHero(createHeroRecoveryState('sera'), 'serious', 1_000);
    expect(isHeroAvailable(wounded, wounded.recoveryReadyAt! - 1)).toBe(false);
    expect(isHeroAvailable(wounded, wounded.recoveryReadyAt!)).toBe(true);
  });

  it('lets infirmary levels shorten recovery without eliminating it', () => {
    const normal = woundHero(createHeroRecoveryState('orin'), 'critical', 0, 0);
    const improved = woundHero(createHeroRecoveryState('orin'), 'critical', 0, 3);
    expect(improved.recoveryReadyAt!).toBeLessThan(normal.recoveryReadyAt!);
    expect(improved.recoveryReadyAt!).toBeGreaterThan(0);
  });

  it('clears injury state only when recovery is ready', () => {
    const wounded = woundHero(createHeroRecoveryState('mara'), 'light', 0);
    expect(recoverHero(wounded, wounded.recoveryReadyAt! - 1).injury).toBe('light');
    expect(recoverHero(wounded, wounded.recoveryReadyAt!).injury).toBeNull();
  });
});
