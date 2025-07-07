import { Request, Response, NextFunction } from "express";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError
} from "@prisma/client/runtime/library";
import { helper } from "../utils";
import { ResponseType } from "../utils/enums";

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
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
  console.error(`${new Date().toISOString()}: ${errMessage}`);
  if (errMessage === ResponseType.TokenExpired) res.status(401);
  else if (errMessage === ResponseType.TokenInvalid) res.status(401);
  else if (errMessage === ResponseType.Unauthorised) res.status(401);
  else res.status(res.statusCode);
  // res.send({ name: err.name, message: err.message });
  const jsonResponse = helper.jsonResponse<string>(false, errMessage);
  res.json(jsonResponse);
}
