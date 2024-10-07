import { format, formatISO } from "date-fns";

// convert date to YYYY-MM-DD
export const convertoISO = (d: Date | string) => formatISO(new Date(d), { representation: "date" });
export const projectStart = formatISO(new Date().addDays(1), { representation: "date" });
export const projectEnd = formatISO(new Date().addDays(30), { representation: "date" });
// date picker min and max
export const minDate = formatISO(new Date().addDays(-1), { representation: "date" });
export const maxDate = formatISO(new Date().addDays(180), { representation: "date" });
export const formatddMMMyyyy = (d: Date | string) => format(d, "dd MMM yyyy");
