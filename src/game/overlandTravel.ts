export type Terrain = 'road' | 'forest' | 'ridge' | 'ruins';

export interface TravelPlanInput {
  distance: number;
  terrain: Terrain;
  roadSecured: boolean;
  escortPower: number;
  threatPower: number;
  carriedSupplies: number;
}

export interface TravelPlan {
  travelMinutes: number;
  rationCost: number;
  ambushRisk: number;
  canDepart: boolean;
  blockers: string[];
}

const TERRAIN_TIME: Record<Terrain, number> = {
  road: 1,
  forest: 1.35,
  ridge: 1.6,
  ruins: 1.8,
};

export function planOverlandTravel(input: TravelPlanInput): TravelPlan {
  const safeDistance = Math.max(0, input.distance);
  const roadFactor = input.roadSecured && input.terrain === 'road' ? 0.75 : 1;
  const travelMinutes = Math.max(1, Math.ceil(safeDistance * 4 * TERRAIN_TIME[input.terrain] * roadFactor));
  const rationCost = Math.max(1, Math.ceil(travelMinutes / 12));
  const powerGap = input.threatPower - input.escortPower;
  const terrainRisk = input.terrain === 'ruins' ? 20 : input.terrain === 'forest' ? 12 : input.terrain === 'ridge' ? 10 : 5;
  const roadRelief = input.roadSecured ? 10 : 0;
  const ambushRisk = Math.max(0, Math.min(95, terrainRisk + Math.max(0, powerGap * 2) - roadRelief));
  const blockers: string[] = [];
  if (input.carriedSupplies < rationCost) blockers.push('insufficient-rations');
  if (input.escortPower <= 0) blockers.push('no-escort');
  if (ambushRisk >= 80) blockers.push('extreme-ambush-risk');
  return { travelMinutes, rationCost, ambushRisk, canDepart: blockers.length === 0, blockers };
}
