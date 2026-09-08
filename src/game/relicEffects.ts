export type KnownRelic = 'Meridian Lens' | 'Guardian Shard';

export interface RelicEffectSummary {
  scoutingBonus: number;
  ruinInsightBonus: number;
  regionalSafetyBonus: number;
  gatewayResearchUnlocked: boolean;
  effects: string[];
}

export function summarizeRelicEffects(relics: string[]): RelicEffectSummary {
  let scoutingBonus = 0;
  let ruinInsightBonus = 0;
  let regionalSafetyBonus = 0;
  let gatewayResearchUnlocked = false;
  const effects: string[] = [];

  if (relics.includes('Meridian Lens')) {
    scoutingBonus += 2;
    ruinInsightBonus += 3;
    gatewayResearchUnlocked = true;
    effects.push('Meridian Lens: improves scouting and ancient-structure analysis; unlocks gateway research lead.');
  }

  if (relics.includes('Guardian Shard')) {
    regionalSafetyBonus += 5;
    ruinInsightBonus += 1;
    effects.push('Guardian Shard: improves regional defense analysis and Guardian-tech study.');
  }

  return { scoutingBonus, ruinInsightBonus, regionalSafetyBonus, gatewayResearchUnlocked, effects };
}
