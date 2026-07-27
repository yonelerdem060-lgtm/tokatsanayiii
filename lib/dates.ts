/** unstable_cache / RSC sınırı sonrası ISO string veya Date kabul eder */
export function toDate(value: Date | string | number): Date {
  if (value instanceof Date) return value;
  return new Date(value);
}

export function toDateOrNull(
  value: Date | string | number | null | undefined,
): Date | null {
  if (value == null) return null;
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatTrDate(
  value: Date | string | number | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  const date = toDateOrNull(value);
  if (!date) return "";
  return date.toLocaleDateString(
    "tr-TR",
    options ?? { day: "numeric", month: "long", year: "numeric" },
  );
}
