function toDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export function formatMonthYear(value: string | null): string {
  const date = toDate(value);

  if (!date) {
    return "Present";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) {
    return "Date unavailable";
  }

  return `${formatMonthYear(start)} - ${formatMonthYear(end)}`;
}
