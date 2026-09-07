import { describe, expect, it } from 'vitest';
import { createStartingWallet } from '../src/game/resources.js';
import { expeditionCapacity, planExpeditionLoadout } from '../src/game/expeditionLoadout.js';

describe('expedition loadout',()=>{
  it('grows carrying capacity with expedition infrastructure',()=>{
    expect(expeditionCapacity(1,1)).toBe(6);
    expect(expeditionCapacity(2,2)).toBe(9);
  });
  it('prices a legal ruin loadout from real resources',()=>{
    const result=planExpeditionLoadout([{supply:'rations',quantity:2},{supply:'rope',quantity:1}],createStartingWallet(),1,1);
    expect(result.totalSlots).toBe(3);
    expect(result.cost).toEqual({food:24,timber:8});
  });
  it('rejects overpacked expeditions',()=>{
    expect(()=>planExpeditionLoadout([{supply:'medicalKit',quantity:4}],createStartingWallet(),1,1)).toThrow('LOADOUT_CAPACITY_EXCEEDED');
  });
});
