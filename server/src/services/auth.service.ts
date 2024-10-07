import { NextFunction, Request, Response } from "express";
import axios from "axios";
import xss from "xss";
import { CAPTCHA_SECRET, RoleType, authelper, dbhelper, helper, fb } from "../util";
import { IToken, IUser } from "../models";

export const signInAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // auth user
    const { uid } = req.body;
    const sanitizedUID = xss(uid);
    const authUser = await authelper.getAuthUser(sanitizedUID);
    if (authUser?.disabled) throw new Error("Email has not been verified or disabled");
    // db user
    let dbUserId = String.empty;
    let role = RoleType.User;
    const dbUser = await dbhelper.getUser(uid);
    if (dbUser) {
      if (dbUser.inactive) throw new Error("User is not active");
      dbUserId = dbUser.id;
      role = dbhelper.getRoleType(dbUser.role);
    } else {
      // create user in db
      const user = await dbhelper.createUser(
        authUser.uid,
        authUser.email || String.empty,
        authUser.displayName || String.empty
      );
      dbUserId = user.id;
    }
    // jwt token
    const tokenAuth: IToken = { id: dbUserId, uid: authUser?.uid, role };
    const token = authelper.getToken(tokenAuth);
    // return model
    const userModel: IUser = {
      name: authUser?.displayName,
      email: authUser?.email,
      photo: authUser?.photoURL,
      role,
      token
    };
    const resJson = helper.responseJson<IUser>(true, helper.removeUndefined(userModel));
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const updateProfileAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req?.auth?.uid || String.empty;
    const { name } = req.body;
    // auth user
    const updateRequest: fb.UpdateRequest = { displayName: name };
    await authelper.updateAuthUser(uid, updateRequest);
    // db user
    await dbhelper.updateProfile(uid, name);
    const resJson = helper.responseJson<string>(true, "Profile has been updated!");
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const deleteProfileAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req?.auth?.uid || String.empty;
    // auth user
    await authelper.deleteAuthUser(uid);
    // db user
    const dbUser = await dbhelper.getUser(uid);
    if (dbUser) {
      await dbhelper.deleteExpenses(dbUser.id);
      await dbhelper.deleteProjects(dbUser.id);
      await dbhelper.deleteUser(dbUser.id);
    }
    const resJson = helper.responseJson<string>(true, "Profile has been deleted!");
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const captchaVerifyAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const captchaSiteUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET}&response=${token}`;
    const response = await axios.post(captchaSiteUrl);
    res.json(response.data);
  } catch (error) {
    return next(error);
  }
};
