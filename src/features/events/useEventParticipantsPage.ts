import { useEffect, useMemo, useState } from "react";
import {
  useBulkUpdateParticipantStatusMutation,
  useCreateParticipantMutation,
  useDeleteParticipantMutation,
  useEventQuery,
  useParticipantsQuery,
  useUpdateParticipantStatusMutation,
} from "../../api/queries";
import {
  getVisibleParticipants,
  type ParticipantStatusFilter,
} from "../participants/participantFilters";
import {
  canChangeStatus,
  canCreateParticipant,
  countComingParticipants,
  getRemainingCapacity,
  isComing,
} from "../../lib/rules";
import type { Participant, ParticipantStatus } from "../../types";

export function useEventParticipantsPage(eventId: string) {
  const eventQuery = useEventQuery(eventId);
  const participantsQuery = useParticipantsQuery();
  const createParticipant = useCreateParticipantMutation();
  const updateStatus = useUpdateParticipantStatusMutation();
  const bulkUpdateStatus = useBulkUpdateParticipantStatusMutation();
  const deleteParticipant = useDeleteParticipantMutation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParticipantStatusFilter>("all");
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<Set<string>>(new Set());
  const [ruleError, setRuleError] = useState<string | null>(null);

  const eventParticipants = useMemo(
    () => (participantsQuery.data ?? []).filter((participant) => participant.eventId === eventId),
    [eventId, participantsQuery.data],
  );

  const visibleParticipants = useMemo(
    () =>
      getVisibleParticipants({
        participants: eventParticipants,
        search,
        statusFilter,
      }),
    [eventParticipants, search, statusFilter],
  );

  useEffect(() => {
    const availableParticipantIds = new Set(eventParticipants.map((participant) => participant.id));

    setSelectedParticipantIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(
        [...currentSelectedIds].filter((participantId) =>
          availableParticipantIds.has(participantId),
        ),
      );

      return nextSelectedIds.size === currentSelectedIds.size ? currentSelectedIds : nextSelectedIds;
    });
  }, [eventParticipants]);

  const event = eventQuery.data;
  const metrics = useMemo(() => {
    if (!event) {
      return {
        comingCount: 0,
        remainingCapacity: 0,
        isFull: false,
      };
    }

    return {
      comingCount: countComingParticipants(eventParticipants),
      remainingCapacity: getRemainingCapacity(event, eventParticipants),
      isFull: !canCreateParticipant(event, eventParticipants),
    };
  }, [event, eventParticipants]);

  const selectedParticipants = useMemo(
    () => eventParticipants.filter((participant) => selectedParticipantIds.has(participant.id)),
    [eventParticipants, selectedParticipantIds],
  );

  const busyParticipantId = getBusyParticipantId({
    updatingParticipantId: updateStatus.variables?.participantId,
    isUpdating: updateStatus.isPending,
    deletingParticipantId: deleteParticipant.variables?.participantId,
    isDeleting: deleteParticipant.isPending,
  });

  async function create(input: { name: string; birthdate?: string }) {
    if (!event) {
      return false;
    }

    setRuleError(null);

    const trimmedName = input.name.trim();

    if (!trimmedName) {
      setRuleError("Participant name is required.");
      return false;
    }

    if (!canCreateParticipant(event, eventParticipants)) {
      setRuleError("This event is full. Cancel or delete a coming participant before adding one.");
      return false;
    }

    await createParticipant.mutateAsync({
      eventId: event.id,
      name: trimmedName,
      birthdate: input.birthdate,
    });

    return true;
  }

  async function changeStatus(participant: Participant, status: ParticipantStatus) {
    if (!event) {
      return;
    }

    setRuleError(null);

    if (!canChangeStatus(event, eventParticipants, participant, status)) {
      setRuleError("Capacity would be exceeded. Move another participant to canceled first.");
      return;
    }

    await updateStatus.mutateAsync({ participantId: participant.id, status });
  }

  async function remove(participantId: string) {
    setRuleError(null);
    const participant = eventParticipants.find((currentParticipant) => currentParticipant.id === participantId);

    if (!participant) {
      return;
    }

    await deleteParticipant.mutateAsync({
      participantId,
      eventId: participant.eventId,
    });
    setSelectedParticipantIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(currentSelectedIds);
      nextSelectedIds.delete(participantId);
      return nextSelectedIds;
    });
  }

  function toggle(participantId: string) {
    setSelectedParticipantIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(currentSelectedIds);

      if (nextSelectedIds.has(participantId)) {
        nextSelectedIds.delete(participantId);
      } else {
        nextSelectedIds.add(participantId);
      }

      return nextSelectedIds;
    });
  }

  function toggleVisible(participantIds: string[], selected: boolean) {
    setSelectedParticipantIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(currentSelectedIds);

      participantIds.forEach((participantId) => {
        if (selected) {
          nextSelectedIds.add(participantId);
        } else {
          nextSelectedIds.delete(participantId);
        }
      });

      return nextSelectedIds;
    });
  }

  function canBulkChangeToStatus(status: ParticipantStatus) {
    if (selectedParticipants.length === 0) {
      return false;
    }

    if (!isComing(status)) {
      return true;
    }

    const selectedParticipantsEnteringCapacity = selectedParticipants.filter(
      (participant) => !isComing(participant.status),
    ).length;

    return selectedParticipantsEnteringCapacity <= metrics.remainingCapacity;
  }

  async function bulkChangeStatus(status: ParticipantStatus) {
    setRuleError(null);
    const participantsToUpdate = [...selectedParticipants];

    if (!canBulkChangeToStatus(status)) {
      setRuleError("Capacity would be exceeded. Move fewer participants into a coming status.");
      return;
    }

    const participantIdsToUpdate = participantsToUpdate
      .filter((participant) => participant.status !== status)
      .map((participant) => participant.id);

    if (participantIdsToUpdate.length > 0) {
      await bulkUpdateStatus.mutateAsync({
        participantIds: participantIdsToUpdate,
        status,
      });
    }

    setSelectedParticipantIds(new Set());
  }

  async function bulkRemove() {
    setRuleError(null);
    const participantsToDelete = [...selectedParticipants];

    for (const participant of participantsToDelete) {
      await deleteParticipant.mutateAsync({
        participantId: participant.id,
        eventId: participant.eventId,
      });
    }

    setSelectedParticipantIds(new Set());
  }

  return {
    event,
    eventParticipants,
    visibleParticipants,
    isLoading: eventQuery.isLoading || participantsQuery.isLoading,
    isError: eventQuery.isError || participantsQuery.isError || !event,
    metrics,
    filters: {
      search,
      statusFilter,
      setSearch,
      setStatusFilter,
    },
    selection: {
      selectedParticipantIds,
      toggle,
      toggleVisible,
    },
    status: {
      busyParticipantId,
      isBulkBusy:
        updateStatus.isPending || bulkUpdateStatus.isPending || deleteParticipant.isPending,
      canBulkChangeToStatus,
    },
    errors: {
      ruleError,
      createError: createParticipant.isError,
      updateError: updateStatus.isError || bulkUpdateStatus.isError,
      deleteError: deleteParticipant.isError,
    },
    actions: {
      create,
      changeStatus,
      remove,
      bulkChangeStatus,
      bulkRemove,
    },
    pending: {
      isCreating: createParticipant.isPending,
    },
  };
}

function getBusyParticipantId({
  updatingParticipantId,
  isUpdating,
  deletingParticipantId,
  isDeleting,
}: {
  updatingParticipantId?: string;
  isUpdating: boolean;
  deletingParticipantId?: string;
  isDeleting: boolean;
}) {
  if (isUpdating) {
    return updatingParticipantId;
  }

  if (isDeleting) {
    return deletingParticipantId;
  }

  return undefined;
}
