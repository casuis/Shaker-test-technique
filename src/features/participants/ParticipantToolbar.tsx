import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { participantStatuses } from "../../types";
import type { ParticipantStatusFilter } from "./participantFilters";

type ParticipantToolbarProps = {
  totalParticipants: number;
  search: string;
  statusFilter: ParticipantStatusFilter;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (statusFilter: ParticipantStatusFilter) => void;
};

export function ParticipantToolbar({
  totalParticipants,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: ParticipantToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-stone-950">Participants</h2>
        <p className="text-sm text-stone-600">{totalParticipants} total participants</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_180px] lg:w-[520px]">
        <label className="relative block">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            aria-hidden
          />
          <input
            value={search}
            onChange={(inputEvent) => onSearchChange(inputEvent.target.value)}
            placeholder="Search name or status"
            className="h-11 w-full rounded-md border border-stone-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label>
          <span className="sr-only">Filter participants by status</span>
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as ParticipantStatusFilter)}
          >
            <SelectTrigger className="h-11 focus:border-emerald-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {participantStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>
    </div>
  );
}
