export interface HeroProgress {
  level: number;
  xp: number;
  skillPoints: number;
}

export interface ProgressAward {
  next: HeroProgress;
  levelsGained: number;
}

export function xpForNextLevel(level: number): number {
  return 100 + Math.max(0, level - 1) * 40;
}

export function awardHeroXp(progress: HeroProgress, gainedXp: number): ProgressAward {
  let level = Math.max(1, progress.level);
  let xp = Math.max(0, progress.xp) + Math.max(0, gainedXp);
  let skillPoints = Math.max(0, progress.skillPoints);
  let levelsGained = 0;
  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level);
    level += 1;
    skillPoints += 1;
    levelsGained += 1;
  }
  return { next: { level, xp, skillPoints }, levelsGained };
}

export function spendSkillPoint(progress: HeroProgress): HeroProgress {
  if (progress.skillPoints < 1) throw new Error('No skill points available');
  return { ...progress, skillPoints: progress.skillPoints - 1 };
}

export function levelPowerBonus(level: number): number {
  return Math.max(0, level - 1) * 2;
}
