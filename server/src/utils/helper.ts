import { formatISO } from "date-fns";
import jwt from "jsonwebtoken";
import { IResponse, IToken } from "../models";
import { UserInfo } from "../providers";
import { AuthType } from "./enums";
import { TOKEN_SECRET } from "./configs";

//#region date helpers

export function dateNow() {
  return formatISO(new Date(), { representation: "date" });
}

export function formatDate(d: Date | string) {
  return formatISO(new Date(d), { representation: "date" });
}

export function parseDate(date: string | undefined): Date {
  return date ? new Date(formatDate(date)) : new Date(dateNow());
}

//#endregion

//#region json helpers

export function jsonResponse<T>(success?: boolean, resource?: T) {
  const response: IResponse<T> = { success, resource };
  return response;
}

export function removeUndefined(obj: any, defaults = [undefined, null, NaN, String.empty]) {
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
}

//#endregion

//#region firebase helpers

export function IsExternaLogin(providerData: UserInfo[] | undefined) {
  return providerData?.some(
    x => x.providerId.includes(AuthType.Google) || x.providerId.includes(AuthType.Facebook)
  );
}

export function getAuthTypes(providerData: UserInfo[] | undefined): AuthType[] | undefined {
  return providerData?.map(x => {
    if (x.providerId.includes(AuthType.Google)) return AuthType.Google;
    if (x.providerId.includes(AuthType.Facebook)) return AuthType.Facebook;
    return AuthType.Email;
  });
}

//#endregion

//#region jwt helpers

export function createToken(payload: IToken) {
  return jwt.sign(payload, TOKEN_SECRET as string, { expiresIn: "7d" });
}

export function verifyToken(token: string): Promise<IToken | string> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET as string, (error, payload) => {
      if (error) return reject(error.name);
      return resolve(payload as IToken);
    });
  });
}

//#endregion
