# Frontend Exercise — Event Participants

We would like you to build a small event management app focused on participant management and business rules.

The goal of this exercise is not to build a perfect UI, but to evaluate how you structure a small frontend application, handle product logic and make technical decisions.

Build the app using React, TypeScript, React Query and TailwindCSS.

APIs:

- Events: https://69fe080c8c70b15fa3ca1d74.mockapi.io/api/events
- Participants: https://69fe080c8c70b15fa3ca1d74.mockapi.io/api/participants

Doc of the APIs https://github.com/mockapi-io/docs/wiki

The app should contain:

- an events list page
- an event page

The events list page should display at least:

- name
- date
- location
- capacity

The event page should display:

- basic event information
- event capacity
- number of participants
- a list of participants with search and actions

A participant is considered "coming" when their status is one of:

- registered
- confirmed
- attended

Canceled participants should not count toward the event capacity.

Event capacity should always be respected.

You should be able to:

- create a participant
- delete a participant
- change a participant status
- search participants

Available participant statuses:

- registered
- confirmed
- attended
- canceled

Particular attention will be paid to:

- respect of business rules
- code quality and scalability
- product thinking
- UI/UX decisions
- TypeScript
- React Query usage

Constraints:

- expected duration: 2–3h
- edge cases should be considered

Include a README with:

- setup instructions
- assumptions made
- what you would improve with more time

During the review, you should be able to explain:

- your technical choices
- architecture decisions
- business rule handling
- edge cases considered