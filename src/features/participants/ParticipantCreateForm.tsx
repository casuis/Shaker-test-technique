import { FormEvent, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "../../components/ui/button";

type ParticipantCreateFormProps = {
  isFull: boolean;
  isSubmitting: boolean;
  onSubmit: (input: { name: string; birthdate?: string }) => Promise<boolean>;
};

export function ParticipantCreateForm({
  isFull,
  isSubmitting,
  onSubmit,
}: ParticipantCreateFormProps) {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await onSubmit({
      name,
      birthdate: birthdate || undefined,
    });

    if (created) {
      setName("");
      setBirthdate("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto] lg:items-end">
        <div className="flex-1">
          <label htmlFor="participant-name" className="text-sm font-medium text-stone-800">
            Add participant
          </label>
          <input
            id="participant-name"
            value={name}
            onChange={(inputEvent) => setName(inputEvent.target.value)}
            placeholder="Full name"
            className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div>
          <label htmlFor="birthdate" className="text-sm font-medium text-stone-800">
            Birthdate
          </label>
          <input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(inputEvent) => setBirthdate(inputEvent.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <Button
          type="submit"
          disabled={isFull || isSubmitting}
          className="h-11"
        >
          <UserPlus size={18} aria-hidden />
          Add
        </Button>
      </div>
      {isFull && (
        <p className="mt-3 text-sm text-amber-800">
          Capacity is full. Canceled participants do not count toward capacity.
        </p>
      )}
    </form>
  );
}
