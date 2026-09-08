import { describe, expect, it } from 'vitest';
import { nextRegionStatus } from '../src/game/nextRegion.js';

describe('next region gate', () => {
  it('keeps Cinder Vale locked until the Ashfall campaign is actually secured', () => {
    const locked = nextRegionStatus({ settlementProgress: 60, ruinCompleted: true, relics: ['Meridian Lens'], guardianDefeated: true, clearedHostiles: ['broken-pike-camp'] });
    expect(locked.unlocked).toBe(false);
    expect(locked.missing.length).toBeGreaterThan(0);

    const unlocked = nextRegionStatus({ settlementProgress: 82, ruinCompleted: true, relics: ['Meridian Lens'], guardianDefeated: true, clearedHostiles: ['broken-pike-camp','grey-banner-patrol'] });
    expect(unlocked.unlocked).toBe(true);
    expect(unlocked.destination).toBe('Cinder Vale');
  });
});
