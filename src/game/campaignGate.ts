export interface CampaignGateInput {
  settlementProgress: number;
  ruinCompleted: boolean;
  guardianDefeated: boolean;
  clearedWorldThreats: number;
  relics: string[];
}

export interface CampaignGateResult {
  phase: 'survival' | 'discovery' | 'security' | 'expansion_ready';
  nextObjective: string;
  nextRegionUnlocked: boolean;
  missing: string[];
}

export function evaluateCampaignGate(input: CampaignGateInput): CampaignGateResult {
  const missing: string[] = [];
  if (input.settlementProgress < 70) missing.push('Raise Ashfall Hold to 70% stabilization.');
  if (!input.ruinCompleted) missing.push('Complete the Buried Meridian expedition.');
  if (!input.guardianDefeated) missing.push('Defeat the Meridian Guardian.');
  if (input.clearedWorldThreats < 2) missing.push('Clear both hostile road forces.');
  if (!input.relics.includes('Meridian Lens')) missing.push('Recover the Meridian Lens.');

  if (!input.ruinCompleted) {
    return { phase: 'survival', nextObjective: 'Stabilize Ashfall Hold and expose the buried chamber.', nextRegionUnlocked: false, missing };
  }
  if (!input.guardianDefeated) {
    return { phase: 'discovery', nextObjective: 'Survive the Buried Meridian and break the Guardian blockade.', nextRegionUnlocked: false, missing };
  }
  if (input.clearedWorldThreats < 2 || input.settlementProgress < 70) {
    return { phase: 'security', nextObjective: 'Secure the Ashfall March roads and strengthen the settlement.', nextRegionUnlocked: false, missing };
  }

  return {
    phase: 'expansion_ready',
    nextObjective: 'Prepare the first expedition beyond Ashfall March.',
    nextRegionUnlocked: true,
    missing,
  };
}
