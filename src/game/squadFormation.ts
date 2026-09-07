export interface SquadHero {
  id: string;
  role: 'vanguard' | 'ranger' | 'scholar' | 'support';
  power: number;
  available: boolean;
}

export interface SquadFormation {
  heroes: SquadHero[];
  totalPower: number;
  roles: string[];
  balanced: boolean;
}

export function formSquad(heroes: SquadHero[], maxHeroes = 3): SquadFormation {
  const selected = heroes.filter(hero => hero.available).sort((a, b) => b.power - a.power).slice(0, maxHeroes);
  const roles = [...new Set(selected.map(hero => hero.role))];
  return {
    heroes: selected,
    totalPower: selected.reduce((sum, hero) => sum + hero.power, 0),
    roles,
    balanced: roles.length >= Math.min(3, selected.length),
  };
}
