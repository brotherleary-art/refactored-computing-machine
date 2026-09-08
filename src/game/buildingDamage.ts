export type DamageState = 'operational' | 'damaged' | 'critical' | 'ruined';

export interface BuildingCondition {
  id: string;
  maxIntegrity: number;
  integrity: number;
}

export interface RepairOrder {
  buildingId: string;
  restore: number;
  timberCost: number;
  stoneCost: number;
  durationSeconds: number;
}

export function damageState(building: BuildingCondition): DamageState {
  const ratio = building.integrity / Math.max(1, building.maxIntegrity);
  if (ratio <= 0) return 'ruined';
  if (ratio < 0.35) return 'critical';
  if (ratio < 0.75) return 'damaged';
  return 'operational';
}

export function productionModifier(building: BuildingCondition): number {
  const state = damageState(building);
  if (state === 'ruined') return 0;
  if (state === 'critical') return 0.35;
  if (state === 'damaged') return 0.7;
  return 1;
}

export function createRepairOrder(building: BuildingCondition): RepairOrder | null {
  const missing = Math.max(0, building.maxIntegrity - building.integrity);
  if (missing === 0) return null;
  return {
    buildingId: building.id,
    restore: missing,
    timberCost: Math.ceil(missing * 0.6),
    stoneCost: Math.ceil(missing * 0.4),
    durationSeconds: Math.max(30, Math.ceil(missing * 3)),
  };
}

export function finishRepair(building: BuildingCondition, order: RepairOrder): BuildingCondition {
  if (order.buildingId !== building.id) throw new Error('Repair order does not match building');
  return { ...building, integrity: Math.min(building.maxIntegrity, building.integrity + order.restore) };
}
