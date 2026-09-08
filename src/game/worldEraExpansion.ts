export type RegionGate = {
  id: string;
  era: number;
  explorationRequired: number;
  ruinsRequired: number;
};

export type WorldProgress = {
  era: number;
  explorationPoints: number;
  ruinsCleared: number;
  unlockedRegions: string[];
};

export function unlockEligibleRegions(progress: WorldProgress, gates: RegionGate[]): WorldProgress {
  const unlocked = new Set(progress.unlockedRegions);
  for (const gate of gates) {
    if (gate.era <= progress.era && progress.explorationPoints >= gate.explorationRequired && progress.ruinsCleared >= gate.ruinsRequired) {
      unlocked.add(gate.id);
    }
  }
  return { ...progress, unlockedRegions: [...unlocked] };
}

export function advanceEra(progress: WorldProgress, requiredRegions: string[]): WorldProgress {
  const allRequiredRegionsUnlocked = requiredRegions.every((id) => progress.unlockedRegions.includes(id));
  if (!allRequiredRegionsUnlocked) throw new Error('cannot advance era before required regions are unlocked');
  return { ...progress, era: progress.era + 1 };
}
