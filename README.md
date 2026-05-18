# Event Participants

Small event management app focused on participant capacity rules.

## Stack

- React + TypeScript
- React Query for server state and mutations
- React Router for the two pages
- TailwindCSS for styling
- Vite for local development and build

## Setup

```bash
npm install
npm run dev
```

The app runs on the URL printed by Vite, usually `http://localhost:5173`.

Useful checks:

```bash
npm run build
npm run lint
```

## API

The app uses the updated MockAPI base URL:

```text
https://69fee1aa8c70b15fa3cad01e.mockapi.io/api
```

Resources:

- `/events`
- `/participants`

## Business Rules

A participant counts as coming when their status is one of:

- `registered`
- `confirmed`
- `attended`

`canceled` participants do not count toward capacity.

Capacity is enforced before:

- creating a participant, because new participants are created as `registered`
- changing a participant from `canceled` to a coming status

Changing between coming statuses is allowed because it does not increase occupancy. Changing any participant to `canceled` is always allowed.

## Assumptions

- Event timestamps are Unix timestamps in seconds.
- Participants belong to an event through `eventId`.
- New participants only require a name; birthdate is optional.
- Participant avatars are generated identicons, including for seeded API data, so the UI does not display real face photos.
- New participants start as `registered`.
- The frontend can prevent normal capacity violations, but the mock API does not provide transactional guarantees if two clients mutate the same event at the exact same time.

## Edge Cases Considered

- Full event disables participant creation.
- Full event disables status changes that would move a canceled participant back into capacity.
- Canceled participants remain visible and searchable.
- Empty event, empty search result, loading, and API error states are handled.
- Deleting a participant invalidates participant data so capacity is recalculated from the server result.

## Improvements With More Time

- Add tests for the capacity rule helpers and mutation guard flows.
- Add optimistic updates with rollback for a faster UI.
- Add server-side filtering or pagination if the participant list grows.
- Add confirmation for destructive deletes.
- Add accessible toast notifications for mutation success and failure.
