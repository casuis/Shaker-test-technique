import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { useEventsQuery } from "../api/queries";
import { EmptyState } from "../components/EmptyState";
import { InlineError } from "../components/InlineError";
import { LoadingBlock } from "../components/LoadingBlock";
import { formatEventDateRange } from "../lib/format";

export function EventsListPage() {
  const eventsQuery = useEventsQuery();

  if (eventsQuery.isLoading) {
    return <LoadingBlock />;
  }

  if (eventsQuery.isError) {
    return <InlineError message="Events could not be loaded. Please retry in a moment." />;
  }

  const events = eventsQuery.data ?? [];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-stone-950">Events</h1>
        <p className="mt-1 text-sm text-stone-600">Select an event to manage its participants.</p>
      </div>

      {events.length === 0 ? (
        <EmptyState title="No events yet" description="Events returned by the API will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group rounded-md border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-950">{event.name}</h2>
                  <p className="mt-2 text-sm text-stone-600">
                    {formatEventDateRange(event.startsAt, event.endsAt)}
                  </p>
                </div>
                <ArrowRight
                  className="mt-1 text-stone-400 transition group-hover:translate-x-1 group-hover:text-emerald-700"
                  size={20}
                  aria-hidden
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-700">
                <span className="inline-flex items-center gap-2 rounded-md bg-stone-100 px-3 py-2">
                  <MapPin size={16} aria-hidden />
                  {event.location}
                </span>
                <span className="inline-flex items-center gap-2 rounded-md bg-stone-100 px-3 py-2">
                  <Users size={16} aria-hidden />
                  {event.capacity} seats
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
