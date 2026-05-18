import type { CreateParticipantInput, Event, Participant, ParticipantStatus } from "../types";
import { getGeneratedAvatarUrl } from "../lib/avatar";

const API_BASE_URL = "https://69fee1aa8c70b15fa3cad01e.mockapi.io/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getEvents() {
  return request<Event[]>("/events");
}

export function getEvent(eventId: string) {
  return request<Event>(`/events/${eventId}`);
}

export function getParticipants() {
  return request<Participant[]>("/participants");
}

export function createParticipant(input: CreateParticipantInput) {
  return request<Participant>("/participants", {
    method: "POST",
    body: JSON.stringify({
      eventId: input.eventId,
      name: input.name,
      avatar: getGeneratedAvatarUrl(input.name),
      birthdate: input.birthdate ? new Date(input.birthdate).toISOString() : undefined,
      status: "registered" satisfies ParticipantStatus,
    }),
  });
}

export function updateParticipantStatus(participantId: string, status: ParticipantStatus) {
  return request<Participant>(`/participants/${participantId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function deleteParticipant(participantId: string) {
  return request<Participant>(`/participants/${participantId}`, {
    method: "DELETE",
  });
}
