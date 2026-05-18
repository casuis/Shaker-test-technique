import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createParticipant,
  deleteParticipant,
  getEvent,
  getEvents,
  getParticipants,
  updateParticipantStatus,
} from "./client";
import type { CreateParticipantInput, ParticipantStatus } from "../types";
import type { Participant } from "../types";

export const queryKeys = {
  events: ["events"] as const,
  event: (eventId: string) => ["events", eventId] as const,
  participants: ["participants"] as const,
};

export function useEventsQuery() {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: getEvents,
  });
}

export function useEventQuery(eventId: string) {
  return useQuery({
    queryKey: queryKeys.event(eventId),
    queryFn: () => getEvent(eventId),
  });
}

export function useParticipantsQuery() {
  return useQuery({
    queryKey: queryKeys.participants,
    queryFn: getParticipants,
  });
}

export function useCreateParticipantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateParticipantInput) => createParticipant(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.participants });
    },
  });
}

export function useUpdateParticipantStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ participantId, status }: { participantId: string; status: ParticipantStatus }) =>
      updateParticipantStatus(participantId, status),
    onMutate: async ({ participantId, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.participants });

      const previousParticipants = queryClient.getQueryData<Participant[]>(queryKeys.participants);

      queryClient.setQueryData<Participant[]>(queryKeys.participants, (participants = []) =>
        participants.map((participant) =>
          participant.id === participantId ? { ...participant, status } : participant,
        ),
      );

      return { previousParticipants };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousParticipants) {
        queryClient.setQueryData(queryKeys.participants, context.previousParticipants);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.participants });
    },
  });
}

export function useDeleteParticipantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantId: string) => deleteParticipant(participantId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.participants });
    },
  });
}
