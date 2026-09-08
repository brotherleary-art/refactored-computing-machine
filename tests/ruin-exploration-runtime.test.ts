import { describe, expect, it } from 'vitest';
import { advanceExploration, beginExploration, enterRuin } from '../src/game/ruinExplorationRuntime.js';

const site = { id: 'hollow-crown', name: 'Hollow Crown', travelMinutes: 30, danger: 3, discovered: true };

describe('ruin exploration runtime', () => {
  it('travels to a discovered ruin and permits entry on arrival', () => {
    let state = beginExploration(site, 5, 3);
    state = advanceExploration(state, site, 30);
    expect(state.status).toBe('arrived');
    expect(state.supplies).toBe(2);
    expect(enterRuin(state).status).toBe('entered');
  });

  it('fails when supplies run out during travel', () => {
    const state = advanceExploration(beginExploration(site, 1, 3), site, 20);
    expect(state.status).toBe('failed');
    expect(state.supplies).toBe(0);
  });
});
