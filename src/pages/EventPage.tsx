import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { InlineError } from "../components/InlineError";
import { LoadingBlock } from "../components/LoadingBlock";
import { EventSummary } from "../features/events/EventSummary";
import { useEventParticipantsPage } from "../features/events/useEventParticipantsPage";
import { ParticipantCreateForm } from "../features/participants/ParticipantCreateForm";
import { ParticipantList } from "../features/participants/ParticipantList";
import { ParticipantToolbar } from "../features/participants/ParticipantToolbar";

export function EventPage() {
  const { eventId = "" } = useParams();
  const page = useEventParticipantsPage(eventId);

  if (page.isLoading) {
    return <LoadingBlock />;
  }

  if (page.isError || !page.event) {
    return <InlineError message="Event details could not be loaded. Please retry in a moment." />;
  }

  return (
    <section className="space-y-6">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to events
      </Link>

      <EventSummary
        event={page.event}
        comingCount={page.metrics.comingCount}
        remainingCapacity={page.metrics.remainingCapacity}
      />

      <ParticipantCreateForm
        isFull={page.metrics.isFull}
        isSubmitting={page.pending.isCreating}
        onSubmit={page.actions.create}
      />

      {page.errors.ruleError && <InlineError message={page.errors.ruleError} />}
      {page.errors.createError && <InlineError message="Participant could not be created." />}
      {page.errors.updateError && <InlineError message="Participant status could not be updated." />}
      {page.errors.deleteError && <InlineError message="Participant could not be deleted." />}

      <div className="space-y-4">
        <ParticipantToolbar
          totalParticipants={page.eventParticipants.length}
          search={page.filters.search}
          statusFilter={page.filters.statusFilter}
          onSearchChange={page.filters.setSearch}
          onStatusFilterChange={page.filters.setStatusFilter}
        />
        <ParticipantList
          participants={page.visibleParticipants}
          allEventParticipants={page.eventParticipants}
          event={page.event}
          busyParticipantId={page.status.busyParticipantId}
          selectedParticipantIds={page.selection.selectedParticipantIds}
          isBulkBusy={page.status.isBulkBusy}
          canBulkChangeToStatus={page.status.canBulkChangeToStatus}
          onToggleParticipant={page.selection.toggle}
          onToggleVisibleParticipants={page.selection.toggleVisible}
          onBulkStatusChange={page.actions.bulkChangeStatus}
          onBulkDelete={page.actions.bulkRemove}
          onStatusChange={page.actions.changeStatus}
          onDelete={page.actions.remove}
        />
      </div>
    </section>
  );
}
