import { Request, Response, NextFunction } from "express";
import { authService } from "../services";

export async function signInAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req?.auth?.uid || String.empty;
    const result = await authService.signInAsync(uid);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function updateProfileAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req?.auth?.uid || String.empty;
    const { name, countryId } = req.body;
    const result = await authService.updateProfileAsync(uid, name, countryId);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function deleteProfileAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req?.auth?.uid || String.empty;
    const result = await authService.deleteProfileAsync(uid);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function captchaVerifyAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;
    const result = await authService.captchaVerifyAsync(token);
    res.json(result.data);
  } catch (error) {
    return next(error);
  }
}
