import { describe, expect, it } from 'vitest';
import { canMonetizeGearPower, equipHeroItem, heroGearPower } from '../src/game/heroGear';

describe('hero gear', () => {
  it('equips earned gear and totals its power', () => {
    let loadout = equipHeroItem({}, { id: 'ash-blade', name: 'Ash Blade', slot: 'weapon', power: 7, source: 'battle', requiredLevel: 2 }, 3);
    loadout = equipHeroItem(loadout, { id: 'lens-charm', name: 'Lens Charm', slot: 'charm', power: 4, source: 'ruin', requiredLevel: 1 }, 3);
    expect(heroGearPower(loadout)).toBe(11);
  });

  it('blocks gear above the hero level', () => {
    expect(() => equipHeroItem({}, { id: 'warden-mail', name: 'Warden Mail', slot: 'armor', power: 12, source: 'crafting', requiredLevel: 5 }, 2))
      .toThrow('HERO_LEVEL_TOO_LOW');
  });

  it('keeps paid power out of the gear system', () => {
    expect(canMonetizeGearPower()).toBe(false);
  });
});
