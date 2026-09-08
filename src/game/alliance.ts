export interface AllianceState {
  name: string;
  founderId: string;
  members: string[];
  maxMembers: number;
}

export function createAlliance(name: string, founderId: string, maxMembers = 20): AllianceState {
  const cleanName = name.trim();
  if (cleanName.length < 3 || cleanName.length > 32) throw new Error('Alliance name must be 3-32 characters.');
  if (!founderId) throw new Error('Founder is required.');
  return { name: cleanName, founderId, members: [founderId], maxMembers };
}

export function joinAlliance(alliance: AllianceState, playerId: string): AllianceState {
  if (!playerId) throw new Error('Player is required.');
  if (alliance.members.includes(playerId)) return alliance;
  if (alliance.members.length >= alliance.maxMembers) throw new Error('Alliance is full.');
  return { ...alliance, members: [...alliance.members, playerId] };
}

export function leaveAlliance(alliance: AllianceState, playerId: string): AllianceState {
  if (playerId === alliance.founderId) throw new Error('Founder must transfer leadership before leaving.');
  return { ...alliance, members: alliance.members.filter((member) => member !== playerId) };
}
