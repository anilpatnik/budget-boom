import NodeCache from "node-cache";
import rateLimit from "express-rate-limit";
import { format, formatISO } from "date-fns";
import { IResponse } from "../models";

// date time functions
export const dateNow = () => formatISO(new Date(), { representation: "date" });
export const timeNow = () => formatISO(new Date(), { representation: "time" });
export const formatDate = (d: Date | string) => formatISO(new Date(d), { representation: "date" });
export const formatTime = (d: Date | string) => formatISO(new Date(d), { representation: "time" });
export const formatddMMMyyyy = (d: Date | string) => format(d, "dd MMM yyyy");

export const parseDate = (date: string | undefined): Date => {
  return date ? new Date(formatDate(date)) : new Date(dateNow());
};

export const responseJson = <T>(success?: boolean, resource?: T) => {
  const response: IResponse<T> = { success, resource };
  return response;
};

export const removeUndefined = (obj: any, defaults = [undefined, null, NaN, String.empty]) => {
  if (defaults.includes(obj)) return;

  if (Array.isArray(obj))
    return obj
      .map(v => (v && typeof v === "object" ? removeUndefined(v, defaults) : v))
      .filter(v => !defaults.includes(v));

  return Object.entries(obj).length
    ? Object.entries(obj)
        .map(([k, v]) => [k, v && typeof v === "object" ? removeUndefined(v, defaults) : v])
        .reduce((a, [k, v]) => (defaults.includes(v) ? a : { ...a, [k]: v }), {})
    : obj;
};

export const LogError = (message: string) => {
  const error: string = `error: [${dateNow()} ${timeNow()}] ${message}`;
  console.error(error);
};

export const limiter = rateLimit({
  windowMs: 30 * 1000 * 1, // 30 sec
  max: 100, // limit each IP to 100 requests per window
  message: "too many requests, please try again after 2 minutes",
  headers: true
});
// cache
export const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
