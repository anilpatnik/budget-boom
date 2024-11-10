import { NextFunction, Request, Response } from "express";
import { RoleType, SearchType, authelper, dbhelper, helper, fb } from "../util";
import { IAdminUser, IAdminUserData, IAdminUserSearch } from "../models";
import { mockUsers } from "./mock.service";

export const getUsersAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req?.auth?.uid || String.empty;
    // search filters
    const userSearch: IAdminUserSearch = req.body;
    let whereCondition = {};
    whereCondition = { ...whereCondition, uid: { not: uid } };
    // name or email filter
    if (userSearch?.searchInput) {
      if (userSearch.searchType === SearchType.Name) {
        whereCondition = {
          ...whereCondition,
          name: { contains: userSearch.searchInput, mode: "insensitive" }
        };
      }
      if (userSearch.searchType === SearchType.Email) {
        whereCondition = {
          ...whereCondition,
          email: { contains: userSearch.searchInput, mode: "insensitive" }
        };
      }
    }
    // active users only
    if (userSearch.active) {
      whereCondition = {
        ...whereCondition,
        inactive: { equals: false }
      };
    }
    // role filter
    if (userSearch?.role && userSearch?.role !== RoleType.Admin) {
      const dbrole = dbhelper.getdbRoleType(userSearch.role);
      whereCondition = {
        ...whereCondition,
        role: { equals: dbrole }
      };
    }
    //
    // get all users
    // const [dbUsers, count] = await mockUsers(50);
    const [dbUsers, count] = await dbhelper.getUsers(
      whereCondition,
      userSearch.page,
      userSearch.size
    );
    const users: IAdminUser[] = dbUsers?.map(dbUser => {
      const role = dbUser?.role ? dbhelper.getRoleType(dbUser.role) : RoleType.User;
      return {
        id: dbUser?.id,
        uid: dbUser?.uid,
        name: dbUser?.name || String.empty,
        email: dbUser?.email,
        role
      };
    });
    const userData: IAdminUserData = { data: users, count };
    const resJson = helper.responseJson<IAdminUserData>(true, userData);
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const getUserAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.params.userid;
    // auth user
    const authUser = await authelper.getAuthUser(uid);
    const external = authelper.IsExternaLogin(authUser?.providerData);
    const emailVerified = !external ? authUser?.emailVerified : true;
    const providers = authelper.getAuthTypes(authUser?.providerData);
    // db user
    const dbUser = await dbhelper.getUser(uid);
    const role = dbUser?.role ? dbhelper.getRoleType(dbUser.role) : RoleType.User;
    // return model
    const user: IAdminUser = {
      id: dbUser?.id,
      uid: dbUser?.uid,
      name: dbUser?.name || String.empty,
      email: dbUser?.email,
      photo: authUser?.photoURL,
      emailVerified,
      disabled: authUser?.disabled,
      providers: providers,
      role
    };
    const resJson = helper.responseJson<IAdminUser>(true, helper.removeUndefined(user));
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const upsertUserAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: IAdminUser = req.body;
    if (!request?.uid) {
      await createUserRecordAsync(request?.name, request?.email, request?.password, request?.role);
    } else {
      await updateUserRecordAsync(
        request?.uid,
        request?.name,
        request?.emailVerified,
        request?.disabled,
        request?.role
      );
    }
    const resJson = helper.responseJson<string>(
      true,
      !request?.uid ? "User created!" : "User info has been updated!"
    );
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const deleteUserAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.params.userid;
    // auth user
    await authelper.deleteAuthUser(uid);
    // db user
    const dbUser = await dbhelper.getUser(uid);
    if (dbUser) {
      await dbhelper.deleteExpenses(dbUser.id);
      await dbhelper.deleteProjects(dbUser.id);
      await dbhelper.deleteUser(dbUser.id);
    }
    const resJson = helper.responseJson<string>(true, "User deleted!");
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

const createUserRecordAsync = async (
  name?: string,
  email?: string,
  password?: string,
  role?: RoleType
) => {
  // auth user
  const createRequest: fb.CreateRequest = {
    displayName: name,
    email,
    emailVerified: true,
    disabled: false,
    password
  };
  const authUser = await authelper.createAuthUser(createRequest);
  // db user
  const dbrole = dbhelper.getdbRoleType(role || RoleType.User);
  const dbUser = await dbhelper.createUser(
    authUser.uid,
    email || String.empty,
    name || String.empty,
    dbrole
  );
  return dbUser.id;
};

const updateUserRecordAsync = async (
  uid: string,
  name?: string,
  emailVerified?: boolean,
  disabled?: boolean,
  role?: RoleType
) => {
  // auth user
  const updateRequest: fb.UpdateRequest = {
    displayName: name,
    emailVerified,
    disabled
  };
  const authUser = await authelper.updateAuthUser(uid, updateRequest);
  // db user
  const dbrole = dbhelper.getdbRoleType(role || RoleType.User);
  const dbUser = await dbhelper.updateUser(uid, name || String.empty, dbrole);
  return dbUser.id;
};
