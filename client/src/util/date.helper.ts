import { format, formatISO, getYear, parse, add, endOfMonth } from "date-fns";

// convert date to YYYY-MM-DD
export const convertoISO = (d: Date | string) => formatISO(new Date(d), { representation: "date" });

export const dateNow = formatISO(new Date(), { representation: "date" });

export const dateAdd = (days: number) =>
  formatISO(new Date().addDays(days), { representation: "date" });

export const dateFormat = (d: Date | string) => format(d, "dd MMM yyyy");

export const getTaxDates = (monthName: string) => {
  const currentYear = getYear(new Date());
  const monthIndex = getMonthIndexFromName(monthName);
  const taxStartDate = formatISO(new Date(currentYear, monthIndex, 1), { representation: "date" });
  const twelveMonthsLater = add(new Date(taxStartDate), { months: 11 });
  const taxEndDate = formatISO(endOfMonth(twelveMonthsLater), { representation: "date" });
  return { taxStartDate, taxEndDate };
};

export const getMonthIndexFromName = (monthName: string) => {
  const parsedDate = parse(monthName, "MMMM", new Date());
  return parsedDate.getMonth();
};
