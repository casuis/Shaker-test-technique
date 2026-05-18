import { Trash2 } from "lucide-react";
import { EmptyState } from "../../components/EmptyState";
import { GeneratedAvatar } from "../../components/GeneratedAvatar";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { formatBirthdate } from "../../lib/format";
import { canChangeStatus, isComing } from "../../lib/rules";
import type { Event, Participant, ParticipantStatus } from "../../types";
import { participantStatuses } from "../../types";

type ParticipantListProps = {
  participants: Participant[];
  allEventParticipants: Participant[];
  event: Event;
  busyParticipantId?: string;
  selectedParticipantIds: Set<string>;
  isBulkBusy: boolean;
  canBulkChangeToStatus: (status: ParticipantStatus) => boolean;
  onToggleParticipant: (participantId: string) => void;
  onToggleVisibleParticipants: (participantIds: string[], selected: boolean) => void;
  onBulkStatusChange: (status: ParticipantStatus) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onStatusChange: (participant: Participant, status: ParticipantStatus) => Promise<void>;
  onDelete: (participantId: string) => Promise<void>;
};

export function ParticipantList({
  participants,
  allEventParticipants,
  event,
  busyParticipantId,
  selectedParticipantIds,
  isBulkBusy,
  canBulkChangeToStatus,
  onToggleParticipant,
  onToggleVisibleParticipants,
  onBulkStatusChange,
  onBulkDelete,
  onStatusChange,
  onDelete,
}: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <EmptyState
        title="No participants found"
        description="Try another search or add a participant to this event."
      />
    );
  }

  const visibleParticipantIds = participants.map((participant) => participant.id);
  const selectedVisibleCount = visibleParticipantIds.filter((participantId) =>
    selectedParticipantIds.has(participantId),
  ).length;
  const selectedCount = selectedParticipantIds.size;
  const areAllVisibleSelected =
    visibleParticipantIds.length > 0 && selectedVisibleCount === visibleParticipantIds.length;
  const isSomeVisibleSelected =
    selectedVisibleCount > 0 && selectedVisibleCount < visibleParticipantIds.length;

  return (
    <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm">
      <BulkActions
        selectedCount={selectedCount}
        isBusy={isBulkBusy}
        canBulkChangeToStatus={canBulkChangeToStatus}
        onBulkStatusChange={onBulkStatusChange}
        onBulkDelete={onBulkDelete}
      />
      <div className="hidden grid-cols-[36px_1fr_150px_170px_80px] gap-4 border-b border-stone-200 px-4 py-3 text-xs font-semibold uppercase text-stone-500 md:grid">
        <Checkbox
          checked={areAllVisibleSelected || (isSomeVisibleSelected && "indeterminate")}
          onCheckedChange={(checked) =>
            onToggleVisibleParticipants(visibleParticipantIds, checked === true)
          }
          aria-label="Select visible participants"
        />
        <span>Name</span>
        <span>Birthdate</span>
        <span>Status</span>
        <span className="text-right">Action</span>
      </div>
      <div className="divide-y divide-stone-200">
        {participants.map((participant) => (
          <ParticipantRow
            key={participant.id}
            participant={participant}
            eventParticipants={allEventParticipants}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            isBusy={busyParticipantId === participant.id}
            isSelected={selectedParticipantIds.has(participant.id)}
            onToggleParticipant={onToggleParticipant}
            event={event}
          />
        ))}
      </div>
    </div>
  );
}

function BulkActions({
  selectedCount,
  isBusy,
  canBulkChangeToStatus,
  onBulkStatusChange,
  onBulkDelete,
}: {
  selectedCount: number;
  isBusy: boolean;
  canBulkChangeToStatus: (status: ParticipantStatus) => boolean;
  onBulkStatusChange: (status: ParticipantStatus) => Promise<void>;
  onBulkDelete: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-stone-700">
        {selectedCount} selected
      </p>
      <div className="grid gap-2 sm:grid-cols-[190px_auto]">
        <Select
          disabled={selectedCount === 0 || isBusy}
          onValueChange={(status) => void onBulkStatusChange(status as ParticipantStatus)}
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue placeholder="Change status" />
          </SelectTrigger>
          <SelectContent>
            {participantStatuses.map((status) => (
              <SelectItem
                key={status}
                value={status}
                disabled={!canBulkChangeToStatus(status)}
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={selectedCount === 0 || isBusy}
          onClick={() => void onBulkDelete()}
        >
          <Trash2 size={16} aria-hidden />
          Delete selected
        </Button>
      </div>
    </div>
  );
}

function ParticipantRow({
  participant,
  eventParticipants,
  event,
  onStatusChange,
  onDelete,
  isBusy,
  isSelected,
  onToggleParticipant,
}: {
  participant: Participant;
  eventParticipants: Participant[];
  event: Event;
  onStatusChange: (participant: Participant, status: ParticipantStatus) => Promise<void>;
  onDelete: (participantId: string) => Promise<void>;
  isBusy: boolean;
  isSelected: boolean;
  onToggleParticipant: (participantId: string) => void;
}) {
  return (
    <div className="grid gap-3 px-4 py-4 md:grid-cols-[36px_1fr_150px_170px_80px] md:items-center">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleParticipant(participant.id)}
        aria-label={`Select ${participant.name}`}
      />
      <div className="flex min-w-0 items-center gap-3">
        <GeneratedAvatar seed={`${participant.id}-${participant.name}`} label={participant.name} />
        <div className="min-w-0">
          <p className="truncate font-medium text-stone-950">{participant.name}</p>
          <p className={isComing(participant.status) ? "text-xs text-emerald-700" : "text-xs text-stone-500"}>
            {isComing(participant.status) ? "Counts toward capacity" : "Does not count toward capacity"}
          </p>
        </div>
      </div>

      <div className="text-sm text-stone-600">{formatBirthdate(participant.birthdate)}</div>

      <Select
        value={participant.status}
        disabled={isBusy}
        onValueChange={(status) => void onStatusChange(participant, status as ParticipantStatus)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {participantStatuses.map((status) => (
            <SelectItem
              key={status}
              value={status}
              disabled={!canChangeStatus(event, eventParticipants, participant, status)}
            >
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        onClick={() => void onDelete(participant.id)}
        disabled={isBusy}
        variant="outline"
        size="icon"
        className="text-stone-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
        aria-label={`Delete ${participant.name}`}
        title={`Delete ${participant.name}`}
      >
        <Trash2 size={18} aria-hidden />
      </Button>
    </div>
  );
}
