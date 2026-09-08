import { describe, expect, it } from 'vitest';
import { formSquad } from '../src/game/squadFormation.js';

describe('hero squad formation', () => {
  it('uses only available heroes and prefers power', () => {
    const squad = formSquad([
      { id: 'sera', role: 'vanguard', power: 18, available: true },
      { id: 'orin', role: 'scholar', power: 15, available: true },
      { id: 'mara', role: 'ranger', power: 16, available: true },
      { id: 'ilya', role: 'support', power: 30, available: false },
    ]);
    expect(squad.heroes.map(h => h.id)).toEqual(['sera', 'mara', 'orin']);
    expect(squad.totalPower).toBe(49);
    expect(squad.balanced).toBe(true);
  });
});
