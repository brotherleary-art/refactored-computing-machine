import { describe, expect, it } from 'vitest';
import { planConstruction } from '../src/game/constructionPlanner.js';

describe('construction planner', () => {
  it('chooses the highest-priority affordable unblocked build', () => {
    const plan = planConstruction([
      { id: 'hall', label: 'Town Hall', priority: 1, affordable: true, completed: true },
      { id: 'farm', label: 'Farm', priority: 2, affordable: true, requires: ['hall'] },
      { id: 'forge', label: 'Forge', priority: 3, affordable: true, requires: ['barracks'] },
      { id: 'store', label: 'Storehouse', priority: 4, affordable: false, requires: ['hall'] },
    ]);
    expect(plan.next?.id).toBe('farm');
    expect(plan.blocked.map(x => x.id)).toContain('forge');
    expect(plan.ready.map(x => x.id)).toEqual(['farm']);
  });
});
