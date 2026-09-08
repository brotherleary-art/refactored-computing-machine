export interface RuntimeConstructionOrder {
  buildingId: string;
  targetLevel: number;
  readyAt: number;
}

export interface ConstructionRuntimeInput {
  now: number;
  levels: Record<string, number>;
  queue: RuntimeConstructionOrder[];
}

export function advanceConstructionRuntime(input: ConstructionRuntimeInput) {
  const levels = { ...input.levels };
  const queue: RuntimeConstructionOrder[] = [];
  const completed: string[] = [];
  for (const order of input.queue) {
    if (order.readyAt <= input.now) {
      levels[order.buildingId] = Math.max(levels[order.buildingId] ?? 0, order.targetLevel);
      completed.push(order.buildingId);
    } else queue.push({ ...order });
  }
  return { levels, queue, completed };
}
