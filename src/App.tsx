import { Link, Navigate, Route, Routes } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { EventPage } from "./pages/EventPage";
import { EventsListPage } from "./pages/EventsListPage";

export function App() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#172018]">
      <header className="border-b border-stone-200 bg-white/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/events" className="flex items-center gap-2 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-700 text-white">
              <CalendarDays size={20} aria-hidden />
            </span>
            Event Participants
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:eventId" element={<EventPage />} />
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </main>
    </div>
  );
}
