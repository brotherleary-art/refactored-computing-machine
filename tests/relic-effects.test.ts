import { describe, expect, it } from 'vitest';
import { summarizeRelicEffects } from '../src/game/relicEffects';

describe('relic effects', () => {
  it('keeps unknown/no relics neutral', () => {
    expect(summarizeRelicEffects([])).toEqual({
      scoutingBonus: 0,
      ruinInsightBonus: 0,
      regionalSafetyBonus: 0,
      gatewayResearchUnlocked: false,
      effects: [],
    });
  });

  it('makes the Meridian Lens materially useful', () => {
    const result = summarizeRelicEffects(['Meridian Lens']);
    expect(result.scoutingBonus).toBe(2);
    expect(result.ruinInsightBonus).toBe(3);
    expect(result.gatewayResearchUnlocked).toBe(true);
  });

  it('stacks distinct relic effects without combat pay-to-win power', () => {
    const result = summarizeRelicEffects(['Meridian Lens', 'Guardian Shard']);
    expect(result.ruinInsightBonus).toBe(4);
    expect(result.regionalSafetyBonus).toBe(5);
    expect(result.effects).toHaveLength(2);
  });
});
