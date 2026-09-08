export interface SupplyRoute {
  id: string;
  distance: number;
  danger: number;
  roadQuality: number;
}

export interface SupplyPlan {
  capacity: number;
  delivered: number;
  losses: number;
  travelMinutes: number;
  viable: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function planSupplyRun(route: SupplyRoute, requested: number, escortPower: number): SupplyPlan {
  const distance = Math.max(1, route.distance);
  const road = clamp(route.roadQuality, 0, 100);
  const danger = clamp(route.danger, 0, 100);
  const capacity = Math.max(10, Math.floor(40 + road * 0.8 + escortPower * 0.6));
  const loaded = Math.min(Math.max(0, requested), capacity);
  const exposure = clamp(danger - escortPower * 0.7 - road * 0.25, 0, 90);
  const losses = Math.min(loaded, Math.floor(loaded * (exposure / 100)));
  const delivered = loaded - losses;
  const travelMinutes = Math.max(5, Math.ceil(distance * (1.8 - road / 100)));
  return { capacity, delivered, losses, travelMinutes, viable: delivered > 0 && escortPower >= Math.ceil(danger * 0.25) };
}

export function roadUpgradeBenefit(route: SupplyRoute, upgradedRoadQuality: number, requested: number, escortPower: number): number {
  const before = planSupplyRun(route, requested, escortPower).delivered;
  const after = planSupplyRun({ ...route, roadQuality: upgradedRoadQuality }, requested, escortPower).delivered;
  return after - before;
}
