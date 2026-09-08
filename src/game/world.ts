export type WorldLocationType = 'settlement' | 'resource' | 'ruin' | 'enemy' | 'landmark';

export interface WorldLocation {
  id: string;
  name: string;
  type: WorldLocationType;
  x: number;
  y: number;
  danger: 0 | 1 | 2 | 3 | 4 | 5;
  resource?: 'food' | 'timber' | 'stone' | 'clay' | 'iron';
  storyGate?: string;
}

export const STARTING_REGION_LOCATIONS: WorldLocation[] = [
  { id: 'home', name: 'Ashfall Hold', type: 'settlement', x: 50, y: 50, danger: 0 },
  { id: 'grove-1', name: 'Greenwake Grove', type: 'resource', x: 42, y: 48, danger: 0, resource: 'timber' },
  { id: 'field-1', name: 'Lowfield', type: 'resource', x: 55, y: 43, danger: 0, resource: 'food' },
  { id: 'quarry-1', name: 'Splitstone Shelf', type: 'resource', x: 62, y: 50, danger: 1, resource: 'stone' },
  { id: 'clay-1', name: 'Redbank Cut', type: 'resource', x: 47, y: 59, danger: 1, resource: 'clay' },
  { id: 'iron-1', name: 'Blackvein Rise', type: 'resource', x: 68, y: 57, danger: 2, resource: 'iron' },
  { id: 'enemy-1', name: 'Broken Pike Camp', type: 'enemy', x: 58, y: 62, danger: 1 },
  { id: 'enemy-2', name: 'Grey Banner Patrol', type: 'enemy', x: 71, y: 46, danger: 2 },
  { id: 'ruin-1', name: 'The Sunken Watch', type: 'ruin', x: 39, y: 65, danger: 1 },
  { id: 'ruin-2', name: 'Vault of Quiet Iron', type: 'ruin', x: 76, y: 61, danger: 3, storyGate: 'academy-1' },
  { id: 'ruin-3', name: 'Glassroot Chamber', type: 'ruin', x: 31, y: 52, danger: 2, storyGate: 'expedition-hall-1' },
  { id: 'major-ruin', name: 'The Buried Meridian', type: 'ruin', x: 82, y: 70, danger: 4, storyGate: 'first-major-ruin' },
  { id: 'landmark-1', name: 'Cinder Bridge', type: 'landmark', x: 52, y: 70, danger: 1 },
  { id: 'landmark-2', name: 'Old Crown Road', type: 'landmark', x: 61, y: 35, danger: 1 },
  { id: 'landmark-3', name: 'Mirror Fen', type: 'landmark', x: 34, y: 39, danger: 2 },
  { id: 'enemy-3', name: 'Ash Hound Den', type: 'enemy', x: 27, y: 61, danger: 2 },
  { id: 'enemy-4', name: 'Riven Spear Redoubt', type: 'enemy', x: 85, y: 43, danger: 3 },
  { id: 'grove-2', name: 'Northpine Stand', type: 'resource', x: 46, y: 27, danger: 1, resource: 'timber' },
  { id: 'field-2', name: 'Hearthmere Farms', type: 'resource', x: 66, y: 29, danger: 1, resource: 'food' },
  { id: 'stone-2', name: 'Whitecliff Cut', type: 'resource', x: 24, y: 43, danger: 2, resource: 'stone' },
  { id: 'clay-2', name: 'Siltwater Bend', type: 'resource', x: 73, y: 79, danger: 2, resource: 'clay' },
  { id: 'iron-2', name: 'Emberdeep Shaft', type: 'resource', x: 91, y: 59, danger: 4, resource: 'iron' },
  { id: 'ruin-4', name: 'Silent Bell Tower', type: 'ruin', x: 19, y: 72, danger: 3 },
  { id: 'enemy-5', name: 'Carrion Road Raiders', type: 'enemy', x: 57, y: 84, danger: 3 },
  { id: 'landmark-4', name: 'The Pale Obelisk', type: 'landmark', x: 88, y: 82, danger: 5, storyGate: 'realm-foreshadow' }
];

export interface ExplorationState {
  discoveredLocationIds: string[];
}

export const discoverLocation = (state: ExplorationState, locationId: string): ExplorationState =>
  state.discoveredLocationIds.includes(locationId)
    ? state
    : { discoveredLocationIds: [...state.discoveredLocationIds, locationId] };
