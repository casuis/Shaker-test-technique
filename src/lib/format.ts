export function formatEventDateRange(startsAt: number, endsAt: number) {
  const dateFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const timeFormatter = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
  });

  const start = new Date(startsAt * 1000);
  const end = new Date(endsAt * 1000);

  return `${dateFormatter.format(start)} - ${timeFormatter.format(end)}`;
}

export function formatBirthdate(value?: string) {
  if (!value) {
    return "No birthdate";
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}
