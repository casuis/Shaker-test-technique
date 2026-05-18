import { CalendarClock, Users } from "lucide-react";
import { formatEventDateRange } from "../../lib/format";
import type { Event } from "../../types";

type EventSummaryProps = {
  event: Event;
  comingCount: number;
  remainingCapacity: number;
};

export function EventSummary({ event, comingCount, remainingCapacity }: EventSummaryProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-stone-950">{event.name}</h1>
        <div className="mt-4 grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <CalendarClock size={18} className="text-emerald-800" aria-hidden />
            {formatEventDateRange(event.startsAt, event.endsAt)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Users size={18} className="text-emerald-800" aria-hidden />
            {event.location}
          </span>
        </div>
      </div>

      <CapacityMetrics
        capacity={event.capacity}
        comingCount={comingCount}
        remainingCapacity={remainingCapacity}
      />
    </div>
  );
}

function CapacityMetrics({
  capacity,
  comingCount,
  remainingCapacity,
}: {
  capacity: number;
  comingCount: number;
  remainingCapacity: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-md border border-stone-200 bg-white p-4 shadow-sm">
      <Metric label="Capacity" value={capacity} />
      <Metric label="Coming" value={comingCount} />
      <Metric
        label="Left"
        value={remainingCapacity}
        tone={remainingCapacity === 0 ? "danger" : "default"}
      />
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "danger";
}) {
  return (
    <div className="rounded-md bg-stone-100 p-3 text-center">
      <div className={tone === "danger" ? "text-xl font-semibold text-red-700" : "text-xl font-semibold"}>
        {value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase text-stone-500">{label}</div>
    </div>
  );
}
