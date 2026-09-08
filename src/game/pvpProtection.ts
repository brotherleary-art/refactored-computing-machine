export interface ProtectedPvpInput {
  attackerPower: number;
  defenderPower: number;
  defenderShielded: boolean;
  sameAlliance: boolean;
  defenderOfflineMinutes: number;
}

export interface ProtectedPvpDecision {
  allowed: boolean;
  reason: string;
}

export function evaluateProtectedPvp(input: ProtectedPvpInput): ProtectedPvpDecision {
  if (input.defenderShielded) return { allowed: false, reason: 'Defender is protected by a settlement shield.' };
  if (input.sameAlliance) return { allowed: false, reason: 'Alliance members cannot raid one another.' };
  if (input.attackerPower <= 0 || input.defenderPower <= 0) return { allowed: false, reason: 'Both players need a valid power rating.' };
  const ratio = Math.max(input.attackerPower, input.defenderPower) / Math.min(input.attackerPower, input.defenderPower);
  if (ratio > 2.5) return { allowed: false, reason: 'Power gap exceeds the protected PvP limit.' };
  if (input.defenderOfflineMinutes >= 720) return { allowed: false, reason: 'Long-offline protection is active.' };
  return { allowed: true, reason: 'Protected raid rules permit this engagement.' };
}
