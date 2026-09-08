import { describe, expect, it } from 'vitest';
import { assignHero, heroDutyAvailability, releaseHero } from '../src/game/heroDuty.js';

describe('hero duty',()=>{
  it('blocks wounded heroes from assignments',()=>{
    expect(heroDutyAvailability({heroId:'sera',assignment:'recovering',woundedUntil:2000},1000)).toEqual({available:false,reason:'HERO_RECOVERING'});
  });
  it('blocks heroes already committed elsewhere',()=>{
    expect(()=>assignHero({heroId:'orin',assignment:'scouting'},'combat',1000)).toThrow('HERO_ALREADY_ASSIGNED');
  });
  it('releases a recovered hero to idle duty',()=>{
    expect(releaseHero({heroId:'mara',assignment:'recovering',woundedUntil:900},1000)).toEqual({heroId:'mara',assignment:'idle',woundedUntil:undefined});
  });
});
