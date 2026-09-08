import { describe, expect, it } from 'vitest';
import { advanceConstructionWork, reassignConstructionWorkers } from '../src/game/constructionWorkforce';

describe('construction workforce', () => {
  it('requires prerequisite buildings before timer progress', () => {
    expect(() => advanceConstructionWork({ id: 'forge', requiredBuilding: 'Barracks', remainingMinutes: 60, assignedWorkers: 2 }, [], 10)).toThrow(/missing prerequisite/);
  });

  it('turns assigned workers into deterministic timer progress', () => {
    const next = advanceConstructionWork({ id: 'forge', requiredBuilding: 'Barracks', remainingMinutes: 60, assignedWorkers: 2 }, ['Barracks'], 10);
    expect(next.remainingMinutes).toBe(40);
  });

  it('enforces the settlement worker cap', () => {
    expect(() => reassignConstructionWorkers({ id: 'farm', remainingMinutes: 20, assignedWorkers: 1 }, 4, 3)).toThrow(/exceeds settlement cap/);
    expect(reassignConstructionWorkers({ id: 'farm', remainingMinutes: 20, assignedWorkers: 1 }, 3, 3).assignedWorkers).toBe(3);
  });
});
