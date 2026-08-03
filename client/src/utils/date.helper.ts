import { format, formatISO, endOfMonth, startOfMonth, startOfYear, endOfYear } from "date-fns";

export function convertoISO(d: Date | string) {
  if (!d) return "";
  return formatISO(new Date(d), { representation: "date" });
}

export function dateFormat(d: Date | string) {
  return format(d, "dd MMM yyyy");
}

export const dateNow = formatISO(new Date(), { representation: "date" });
export const monthStart = formatISO(startOfMonth(new Date()), { representation: "date" });
export const monthEnd = formatISO(endOfMonth(new Date()), { representation: "date" });
export const yearStart = formatISO(startOfYear(new Date()), { representation: "date" });
export const yearEnd = formatISO(endOfYear(new Date()), { representation: "date" });
