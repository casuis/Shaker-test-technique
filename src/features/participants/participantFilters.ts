import type { Participant, ParticipantStatus } from "../../types";

export type ParticipantStatusFilter = ParticipantStatus | "all";

export function getVisibleParticipants({
  participants,
  search,
  statusFilter,
}: {
  participants: Participant[];
  search: string;
  statusFilter: ParticipantStatusFilter;
}) {
  const normalizedSearch = search.trim().toLowerCase();
  const filteredByStatus =
    statusFilter === "all"
      ? participants
      : participants.filter((participant) => participant.status === statusFilter);

  const searchedParticipants = normalizedSearch
    ? filteredByStatus.filter((participant) =>
        [participant.name, participant.status].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        ),
      )
    : filteredByStatus;

  return [...searchedParticipants].sort((firstParticipant, secondParticipant) =>
    firstParticipant.name.localeCompare(secondParticipant.name),
  );
}
