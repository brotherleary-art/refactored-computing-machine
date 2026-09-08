export type GearSlot = 'weapon' | 'armor' | 'charm';
export type GearSource = 'battle' | 'ruin' | 'crafting';

export interface HeroGearItem {
  id: string;
  name: string;
  slot: GearSlot;
  power: number;
  source: GearSource;
  requiredLevel: number;
}

export type HeroGearLoadout = Partial<Record<GearSlot, HeroGearItem>>;

export function equipHeroItem(loadout: HeroGearLoadout, item: HeroGearItem, heroLevel: number): HeroGearLoadout {
  if (heroLevel < item.requiredLevel) throw new Error('HERO_LEVEL_TOO_LOW');
  if (!['battle', 'ruin', 'crafting'].includes(item.source)) throw new Error('INVALID_GEAR_SOURCE');
  return { ...loadout, [item.slot]: item };
}

export function heroGearPower(loadout: HeroGearLoadout): number {
  return Object.values(loadout).reduce((total, item) => total + (item?.power ?? 0), 0);
}

export function canMonetizeGearPower(): false {
  return false;
}
