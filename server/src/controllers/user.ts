import { Request, Response, NextFunction } from "express";
import { IAdminUser, IAdminUserSearch } from "../models";
import { userService } from "../services";

export async function getUsersAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req?.auth?.uid || String.empty;
    const userSearch: IAdminUserSearch = req.body;
    const result = await userService.getUsersAsync(uid, userSearch);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getUserAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req.params.userid;
    const result = await userService.getUserAsync(uid);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function upsertUserAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const request: IAdminUser = req.body;
    const result = await userService.upsertUserAsync(request);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function deleteUserAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req.params.userid;
    const result = await userService.deleteUserAsync(uid);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}
