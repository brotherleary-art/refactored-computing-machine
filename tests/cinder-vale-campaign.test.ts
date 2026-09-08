import { describe, expect, it } from 'vitest';
import { cinderValeProgress } from '../src/game/cinderValeCampaign.js';

describe('Cinder Vale campaign', () => {
  it('advances objectives in a fixed four-step campaign', () => {
    expect(cinderValeProgress({ gateSecured: true, blackglassSurveyed: true, cinderHostDefeated: false, hollowCrownOpened: false })).toEqual({
      completed: ['secure-gate', 'survey-blackglass'],
      current: 'break-cinder-host',
      percent: 50,
    });
  });
  it('marks the region complete', () => {
    expect(cinderValeProgress({ gateSecured: true, blackglassSurveyed: true, cinderHostDefeated: true, hollowCrownOpened: true }).current).toBeNull();
  });
});
