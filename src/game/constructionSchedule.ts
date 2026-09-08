export interface ConstructionOrder {
  id: string;
  durationSeconds: number;
}

export interface ScheduledConstruction extends ConstructionOrder {
  crew: number;
  startsAt: number;
  completesAt: number;
}

export const scheduleConstructionOrders = (
  orders: ConstructionOrder[],
  crewCount: number,
  nowMs: number,
): ScheduledConstruction[] => {
  if (crewCount < 1) throw new Error('NO_CONSTRUCTION_CREWS');
  const crewAvailableAt = Array.from({ length: crewCount }, () => nowMs);
  return orders.map((order) => {
    let crewIndex = 0;
    for (let index = 1; index < crewAvailableAt.length; index += 1) {
      if (crewAvailableAt[index] < crewAvailableAt[crewIndex]) crewIndex = index;
    }
    const startsAt = crewAvailableAt[crewIndex];
    const completesAt = startsAt + Math.max(0, order.durationSeconds) * 1_000;
    crewAvailableAt[crewIndex] = completesAt;
    return { ...order, crew: crewIndex + 1, startsAt, completesAt };
  });
};
