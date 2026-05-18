export type ParticipantStatus = "registered" | "confirmed" | "attended" | "canceled";

export type Event = {
  id: string;
  name: string;
  startsAt: number;
  endsAt: number;
  location: string;
  capacity: number;
};

export type Participant = {
  id: string;
  eventId: string;
  name: string;
  avatar?: string;
  birthdate?: string;
  status: ParticipantStatus;
};

export type CreateParticipantInput = {
  eventId: string;
  name: string;
  birthdate?: string;
};

export const participantStatuses: ParticipantStatus[] = [
  "registered",
  "confirmed",
  "attended",
  "canceled",
];
