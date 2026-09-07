export interface ExpansionState {
  settlementProgress: number;
  ruinCompleted: boolean;
  relics: string[];
  guardianDefeated: boolean;
  clearedHostiles: string[];
}

export interface NextRegionStatus {
  unlocked: boolean;
  missing: string[];
  destination: 'Cinder Vale';
}

export function nextRegionStatus(state: ExpansionState): NextRegionStatus {
  const missing: string[] = [];
  if (state.settlementProgress < 75) missing.push('Stabilize Ashfall Hold to 75%');
  if (!state.ruinCompleted) missing.push('Complete the Buried Meridian');
  if (!state.relics.includes('Meridian Lens')) missing.push('Recover the Meridian Lens');
  if (!state.guardianDefeated) missing.push('Defeat the Meridian Guardian');
  for (const hostile of ['broken-pike-camp', 'grey-banner-patrol']) {
    if (!state.clearedHostiles.includes(hostile)) missing.push(`Clear ${hostile}`);
  }
  return { unlocked: missing.length === 0, missing, destination: 'Cinder Vale' };
}
