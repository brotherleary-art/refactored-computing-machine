import { describe, expect, it } from 'vitest';
import { awardHeroXp, levelPowerBonus, spendSkillPoint, xpForNextLevel } from '../src/game/heroProgression';

describe('hero progression', () => {
  it('levels heroes and awards skill points across multiple thresholds', () => {
    const result = awardHeroXp({ level: 1, xp: 80, skillPoints: 0 }, 220);
    expect(result.levelsGained).toBe(2);
    expect(result.next.level).toBe(3);
    expect(result.next.skillPoints).toBe(2);
    expect(result.next.xp).toBe(60);
  });

  it('scales the next-level threshold and combat bonus without selling power', () => {
    expect(xpForNextLevel(1)).toBe(100);
    expect(xpForNextLevel(4)).toBe(220);
    expect(levelPowerBonus(5)).toBe(8);
  });

  it('requires earned skill points before spending', () => {
    expect(() => spendSkillPoint({ level: 1, xp: 0, skillPoints: 0 })).toThrow();
    expect(spendSkillPoint({ level: 2, xp: 0, skillPoints: 1 }).skillPoints).toBe(0);
  });
});
