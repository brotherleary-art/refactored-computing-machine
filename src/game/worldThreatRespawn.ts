export type ClearedWorldThreat = {
  clearedAt: number;
  enemyForces: number;
  clears: number;
};

export type ActiveWorldThreat = ClearedWorldThreat & {
  active: true;
  spawnedAt: number;
  nextRewardMultiplier: number;
};

export function respawnWorldThreat(
  threat: ClearedWorldThreat,
  nowMinute: number,
  cooldownMinutes: number,
): ActiveWorldThreat {
  if (!Number.isFinite(cooldownMinutes) || cooldownMinutes <= 0) throw new Error('cooldown must be positive');
  const readyAt = threat.clearedAt + cooldownMinutes;
  if (nowMinute < readyAt) throw new Error(`threat cooldown active until minute ${readyAt}`);
  const escalation = 1 + Math.min(0.5, threat.clears * 0.12);
  return {
    ...threat,
    active: true,
    spawnedAt: nowMinute,
    enemyForces: Math.max(threat.enemyForces + 1, Math.round(threat.enemyForces * escalation)),
    nextRewardMultiplier: Number((1 + Math.min(0.35, threat.clears * 0.08)).toFixed(2)),
  };
}
