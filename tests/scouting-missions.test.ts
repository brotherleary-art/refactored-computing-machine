import { describe, expect, it } from 'vitest';
import { resolveScoutMissions, startScoutMission } from '../src/game/scoutingMissions.js';

describe('scouting missions', () => {
  it('creates longer missions for ruins and higher risk', () => {
    const resource = startScoutMission('grove', 'resource', 1, 0, [])[0];
    const ruin = startScoutMission('vault', 'ruin', 4, 0, [])[0];
    expect(ruin.readyAt).toBeGreaterThan(resource.readyAt);
  });

  it('does not resolve before the travel timer', () => {
    const mission = startScoutMission('watch', 'hostile', 2, 1000, [])[0];
    const early = resolveScoutMissions([mission], new Set(), mission.readyAt - 1);
    expect(early.results).toHaveLength(0);
    expect(early.active).toHaveLength(1);
  });

  it('grants discovery rewards once only', () => {
    const mission = startScoutMission('sunken-watch', 'ruin', 3, 0, [])[0];
    const discovered = new Set<string>();
    const first = resolveScoutMissions([mission], discovered, mission.readyAt);
    expect(first.results).toHaveLength(1);
    expect(first.results[0].intel).toBeGreaterThan(0);
    const second = resolveScoutMissions([mission], discovered, mission.readyAt);
    expect(second.results).toHaveLength(0);
  });
});
