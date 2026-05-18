import type { CreateParticipantInput, Event, Participant, ParticipantStatus } from "../types";
import { getGeneratedAvatarUrl } from "../lib/avatar";

const API_BASE_URL = "https://69fee1aa8c70b15fa3cad01e.mockapi.io/api";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

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
    throw new ApiError(message || `Request failed with status ${response.status}`, response.status);
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

export async function deleteParticipant(participantId: string, eventId: string) {
  try {
    return await request<Participant>(`/participants/${participantId}`, {
      method: "DELETE",
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return request<Participant>(`/participants/${participantId}`, {
        method: "PUT",
        body: JSON.stringify({
          eventId: `deleted-${eventId}-${participantId}`,
          status: "canceled" satisfies ParticipantStatus,
        }),
      });
    }

    throw error;
  }
}
