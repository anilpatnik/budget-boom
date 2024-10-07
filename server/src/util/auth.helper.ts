import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "./config";
import { AuthType, ResponseType, RoleType } from "./enums";
import { IToken } from "../models";
import { LogError, responseJson } from "./helper";
import { UserInfo, CreateRequest, UpdateRequest, fAuth } from "./firebase";

// jwt token
export const getToken = (payload: IToken) => {
  return jwt.sign(payload, TOKEN_SECRET as string, { expiresIn: "6h" });
};
export const verifyToken = (token: string): Promise<IToken | string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET as string, (error, payload) => {
      if (error) return reject(error.name);
      return resolve(payload as IToken);
    });
  });
};
// authorisation
export const authorize = (roles?: RoleType[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace("Bearer ", String.empty) || String.empty;
      // verify token
      const payload = await verifyToken(token);
      if (!payload) throw new Error(ResponseType.TokenInvalid);
      const auth = payload as IToken;
      // verify role
      if (roles && roles?.length > 0 && !roles?.includes(auth?.role ?? RoleType.User))
        throw new Error(ResponseType.Unauthorised);
      // authorized
      req.auth = auth;
      next();
    } catch (error) {
      const err = error as Error;
      LogError(err.message);
      const returnJson = responseJson<string>(false, ResponseType.Unauthorised);
      res.status(401).json(returnJson);
    }
  };
};
// auth functions
export const IsExternaLogin = (providerData: UserInfo[] | undefined) => {
  return providerData?.some(
    x => x.providerId.includes(AuthType.Google) || x.providerId.includes(AuthType.Facebook)
  );
};
export const getAuthTypes = (providerData: UserInfo[] | undefined): AuthType[] | undefined => {
  return providerData?.map(x => {
    if (x.providerId.includes(AuthType.Google)) return AuthType.Google;
    if (x.providerId.includes(AuthType.Facebook)) return AuthType.Facebook;
    return AuthType.Email;
  });
};
export const getAuthUser = async (uid: string) => await fAuth.getUser(uid);
export const createAuthUser = async (payload: CreateRequest) => await fAuth.createUser(payload);
// prettier-ignore
export const updateAuthUser = async (uid: string, payload: UpdateRequest) => await fAuth.updateUser(uid, payload);
export const deleteAuthUser = async (uid: string) => await fAuth.deleteUser(uid);
