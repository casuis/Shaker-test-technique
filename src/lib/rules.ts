import type { Event, Participant, ParticipantStatus } from "../types";

export const comingStatuses = new Set<ParticipantStatus>([
  "registered",
  "confirmed",
  "attended",
]);

export function isComing(status: ParticipantStatus) {
  return comingStatuses.has(status);
}

export function countComingParticipants(participants: Participant[]) {
  return participants.filter((participant) => isComing(participant.status)).length;
}

export function getRemainingCapacity(event: Event, participants: Participant[]) {
  return Math.max(event.capacity - countComingParticipants(participants), 0);
}

export function canCreateParticipant(event: Event, participants: Participant[]) {
  return getRemainingCapacity(event, participants) > 0;
}

export function canChangeStatus(
  event: Event,
  participants: Participant[],
  participant: Participant,
  nextStatus: ParticipantStatus,
) {
  if (!isComing(nextStatus)) {
    return true;
  }

  if (isComing(participant.status)) {
    return true;
  }

  return getRemainingCapacity(event, participants) > 0;
}
