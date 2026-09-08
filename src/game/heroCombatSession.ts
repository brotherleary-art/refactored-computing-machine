export interface HeroCombatant { id: string; hp: number; power: number; }
export interface HeroCombatSession {
  playerId: string;
  encounterId: string;
  revision: number;
  turn: number;
  heroes: HeroCombatant[];
  enemyHp: number;
  complete: boolean;
}

export function strikeEnemy(session: HeroCombatSession, heroId: string): HeroCombatSession {
  if (session.complete) return session;
  const hero = session.heroes.find((candidate) => candidate.id === heroId);
  if (!hero || hero.hp <= 0) throw new Error('hero unavailable');
  const enemyHp = Math.max(0, session.enemyHp - Math.max(0, hero.power));
  return { ...session, enemyHp, turn: session.turn + 1, revision: session.revision + 1, complete: enemyHp === 0 };
}

export function saveHeroCombat(session: HeroCombatSession): string {
  return JSON.stringify(session);
}

export function restoreHeroCombat(payload: string, playerId: string): HeroCombatSession {
  const parsed = JSON.parse(payload) as HeroCombatSession;
  if (parsed.playerId !== playerId) throw new Error('combat save belongs to another player');
  if (!parsed.encounterId || !Array.isArray(parsed.heroes) || parsed.revision < 0) throw new Error('invalid combat save');
  return parsed;
}
