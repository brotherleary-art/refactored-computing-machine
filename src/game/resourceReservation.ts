import type { ResourceId, ResourceWallet } from './resources';

export interface ResourceReservation {
  id: string;
  cost: Partial<ResourceWallet>;
}

export const availableResources = (
  wallet: ResourceWallet,
  reservations: ResourceReservation[],
): ResourceWallet => {
  const available = { ...wallet };
  for (const reservation of reservations) {
    for (const [id, amount] of Object.entries(reservation.cost)) {
      const resourceId = id as ResourceId;
      available[resourceId] = Math.max(0, available[resourceId] - (amount ?? 0));
    }
  }
  return available;
};

export const reserveResources = (
  wallet: ResourceWallet,
  reservations: ResourceReservation[],
  reservation: ResourceReservation,
): ResourceReservation[] => {
  if (reservations.some((existing) => existing.id === reservation.id)) throw new Error('DUPLICATE_RESERVATION');
  const available = availableResources(wallet, reservations);
  const canReserve = Object.entries(reservation.cost).every(
    ([id, amount]) => available[id as ResourceId] >= (amount ?? 0),
  );
  if (!canReserve) throw new Error('INSUFFICIENT_AVAILABLE_RESOURCES');
  return [...reservations, reservation];
};

export const releaseReservation = (
  reservations: ResourceReservation[],
  reservationId: string,
): ResourceReservation[] => reservations.filter((reservation) => reservation.id !== reservationId);
