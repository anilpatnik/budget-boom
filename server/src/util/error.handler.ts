import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError
} from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { helper, ResponseType } from "./";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let errMessage = String.empty;
  let errStack = String.empty;
  if (
    err instanceof PrismaClientKnownRequestError ||
    err instanceof PrismaClientUnknownRequestError ||
    err instanceof PrismaClientRustPanicError ||
    err instanceof PrismaClientInitializationError
  ) {
    // Prisma Exception
    errMessage = "Database Error";
    errStack = err.stack?.replace(":", String.empty) || err.message;
  } else {
    // Default Exception
    const error = err as Error;
    errMessage = error.message;
    errStack = error.stack?.replace(":", String.empty) || error.message;
  }
  helper.LogError(errStack);
  if (errMessage === ResponseType.TokenExpired) res.status(401);
  else if (errMessage === ResponseType.TokenInvalid) res.status(401);
  else if (errMessage === ResponseType.Unauthorised) res.status(401);
  else res.status(res.statusCode);
  // res.send({ name: err.name, message: err.message });
  const returnJson = helper.responseJson<string>(false, errMessage);
  res.json(returnJson);
};
