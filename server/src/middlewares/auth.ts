import { Request, Response, NextFunction } from "express";
import { IToken } from "../models";
import { helper } from "../utils";
import { ResponseType, RoleType } from "../utils/enums";
import { fbService } from "../services";

export function authMiddleware(roles?: RoleType[]) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1] || String.empty;
      if (!token) throw new Error(ResponseType.TokenInvalid);
      // verify token
      const decoded = await fbService.verifyToken(token);
      if (!decoded) throw new Error(ResponseType.TokenInvalid);
      const auth = decoded as IToken;
      // verify role
      if (roles && roles?.length > 0 && !roles?.includes(auth?.role ?? RoleType.User))
        throw new Error(ResponseType.Unauthorised);
      // authenticated
      req.auth = auth;
      next();
    } catch (error) {
      const jsonResponse = helper.jsonResponse<string>(false, ResponseType.Unauthorised);
      res.status(401).json(jsonResponse);
    }
  };
}
