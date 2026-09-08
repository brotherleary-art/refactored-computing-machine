export type HeroRole = 'commander' | 'scout' | 'scholar' | 'engineer';
export type HeroCulture = 'ashfall' | 'karrakh' | 'solkara' | 'myrwood';

export interface HeroStats {
  command: number;
  scouting: number;
  knowledge: number;
  engineering: number;
  resonance: number;
}

export interface Hero {
  id: string;
  name: string;
  role: HeroRole;
  culture: HeroCulture;
  level: number;
  loyalty: number;
  morale: number;
  wounded: boolean;
  stats: HeroStats;
  trait: string;
}

export const STARTING_HEROES: Hero[] = [
  {
    id: 'sera-vale',
    name: 'Sera Vale',
    role: 'commander',
    culture: 'ashfall',
    level: 1,
    loyalty: 78,
    morale: 72,
    wounded: false,
    stats: { command: 7, scouting: 3, knowledge: 2, engineering: 2, resonance: 1 },
    trait: 'Holds the Line: +10% defensive command score while settlement morale is below 50.',
  },
  {
    id: 'orin-thess',
    name: 'Orin Thess',
    role: 'scout',
    culture: 'solkara',
    level: 1,
    loyalty: 64,
    morale: 81,
    wounded: false,
    stats: { command: 3, scouting: 8, knowledge: 4, engineering: 2, resonance: 2 },
    trait: 'Far Eyes: reduces first-time exploration travel cost by 15%.',
  },
  {
    id: 'mara-keln',
    name: 'Mara Keln',
    role: 'engineer',
    culture: 'karrakh',
    level: 1,
    loyalty: 71,
    morale: 69,
    wounded: false,
    stats: { command: 2, scouting: 2, knowledge: 5, engineering: 9, resonance: 1 },
    trait: 'Stonewise: construction projects complete 8% faster when assigned.',
  },
  {
    id: 'ilya-ren',
    name: 'Ilya Ren',
    role: 'scholar',
    culture: 'myrwood',
    level: 1,
    loyalty: 58,
    morale: 76,
    wounded: false,
    stats: { command: 1, scouting: 4, knowledge: 9, engineering: 3, resonance: 6 },
    trait: 'Quiet Resonance: gains extra discovery progress in ancient ruins.',
  },
];

export const getHero = (heroId: string): Hero => {
  const hero = STARTING_HEROES.find((candidate) => candidate.id === heroId);
  if (!hero) throw new Error('HERO_NOT_FOUND');
  return hero;
};

export const adjustLoyalty = (hero: Hero, delta: number): Hero => ({
  ...hero,
  loyalty: Math.max(0, Math.min(100, hero.loyalty + delta)),
});

export const effectiveHeroPower = (hero: Hero): number => {
  const raw = Object.values(hero.stats).reduce((sum, value) => sum + value, 0);
  const condition = hero.wounded ? 0.6 : 1;
  return Math.round(raw * (1 + hero.level * 0.08) * (hero.morale / 100) * condition);
};
