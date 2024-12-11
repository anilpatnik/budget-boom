import { format, formatISO } from "date-fns";
// convert date to YYYY-MM-DD
export const convertoISO = (d: Date | string) => formatISO(new Date(d), { representation: "date" });
export const dateNow = formatISO(new Date(), { representation: "date" });
export const dateT1 = formatISO(new Date().addDays(1), { representation: "date" });
export const dateT30 = formatISO(new Date().addDays(30), { representation: "date" });
export const dateY90 = formatISO(new Date().addDays(-90), { representation: "date" });
export const dateT90 = formatISO(new Date().addDays(90), { representation: "date" });
export const dateFormat = (d: Date | string) => format(d, "dd MMM yyyy");
