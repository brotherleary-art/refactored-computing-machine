import { describe, expect, it } from 'vitest';
import { createBuriedMeridianExpedition, resolveBuriedMeridianChoice } from '../src/game/ruins';

const ilya = {
  name: 'Ilya Ren',
  command: 1,
  scouting: 4,
  knowledge: 9,
  engineering: 3,
  resonance: 6,
};

const mara = {
  name: 'Mara Keln',
  command: 2,
  scouting: 2,
  knowledge: 5,
  engineering: 9,
  resonance: 1,
};

describe('Buried Meridian expedition', () => {
  it('starts with finite supplies and no recovered relics', () => {
    const state = createBuriedMeridianExpedition();
    expect(state.supplies).toBe(3);
    expect(state.progress).toBe(0);
    expect(state.completed).toBe(false);
    expect(state.recoveredRelics).toEqual([]);
  });

  it('rewards a knowledge/resonance approach with strong progress and lower danger', () => {
    const state = createBuriedMeridianExpedition();
    const outcome = resolveBuriedMeridianChoice(state, 'listen', ilya);
    expect(outcome.state.progress).toBeGreaterThanOrEqual(40);
    expect(outcome.state.danger).toBeLessThan(state.danger);
    expect(outcome.state.supplies).toBe(2);
  });

  it('lets engineering make forcing the door less dangerous', () => {
    const state = createBuriedMeridianExpedition();
    const outcome = resolveBuriedMeridianChoice(state, 'force-door', mara);
    expect(outcome.state.progress).toBeGreaterThan(30);
    expect(outcome.state.danger).toBeLessThanOrEqual(21);
  });

  it('can complete the expedition and grant the Meridian Lens exactly once', () => {
    let state = createBuriedMeridianExpedition();
    state = resolveBuriedMeridianChoice(state, 'listen', ilya).state;
    state = resolveBuriedMeridianChoice(state, 'trace-signal', ilya).state;
    const final = resolveBuriedMeridianChoice(state, 'listen', ilya);
    expect(final.state.completed).toBe(true);
    expect(final.state.recoveredRelics).toEqual(['Meridian Lens']);
    expect(final.resourceReward).toEqual({ iron: 25, stone: 40 });

    const repeat = resolveBuriedMeridianChoice(final.state, 'listen', ilya);
    expect(repeat.state.recoveredRelics).toEqual(['Meridian Lens']);
    expect(repeat.resourceReward).toBeUndefined();
  });
});
