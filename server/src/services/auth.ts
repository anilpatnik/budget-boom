import axios from "axios";
import { IToken, IUser } from "../models";
import { UpdateRequest } from "../providers";
import { dbService, fbService } from "../services";
import { helper } from "../utils";
import { CAPTCHA_SECRET } from "../utils/configs";
import { RoleType } from "../utils/enums";

export async function signInAsync(uid: string) {
  // auth user
  const authUser = await fbService.getAuthUser(uid);
  if (authUser?.disabled) throw new Error("Email has not been verified or disabled");
  // db user
  let dbUserId = String.empty;
  let role = RoleType.User;
  const dbUser = await dbService.getUser(uid);
  if (dbUser) {
    if (dbUser.inactive) throw new Error("User is not active");
    dbUserId = dbUser.id;
    role = dbService.getRoleType(dbUser.role);
  } else {
    // create user in db
    const user = await dbService.createUser(
      authUser.uid,
      authUser.email || String.empty,
      authUser.displayName || String.empty
    );
    dbUserId = user.id;
  }
  // jwt token
  const tokenAuth: IToken = { id: dbUserId, uid: authUser?.uid, role };
  const token = helper.createToken(tokenAuth);
  // return model
  const userModel: IUser = {
    name: authUser?.displayName,
    email: authUser?.email,
    photo: authUser?.photoURL,
    role,
    token,
    countryId: dbUser?.countryId || String.empty
  };
  return helper.jsonResponse<IUser>(true, helper.removeUndefined(userModel));
}

export async function updateProfileAsync(uid: string, name: string, countryId: string) {
  // auth user
  const updateRequest: UpdateRequest = { displayName: name };
  await fbService.updateAuthUser(uid, updateRequest);
  // db user
  await dbService.updateProfile(uid, name, countryId);
  return helper.jsonResponse<string>(true, "Profile has been updated!");
}

export async function deleteProfileAsync(uid: string) {
  // auth user
  await fbService.deleteAuthUser(uid);
  // db user
  const dbUser = await dbService.getUser(uid);
  if (dbUser) {
    await dbService.deleteExpenses(dbUser.id);
    await dbService.deleteProjects(dbUser.id);
    await dbService.deleteUser(dbUser.id);
  }
  return helper.jsonResponse<string>(true, "Profile has been deleted!");
}

export async function captchaVerifyAsync(token: string) {
  const captchaSiteUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET}&response=${token}`;
  return await axios.post(captchaSiteUrl);
}
