import { IAdminUser, IAdminUserData, IAdminUserSearch } from "../models";
import { CreateRequest, UpdateRequest } from "../providers";
import { dbService, fbService } from "../services";
import { helper } from "../utils";
import { RoleType, SearchType } from "../utils/enums";

export async function getUsersAsync(uid: string, userSearch: IAdminUserSearch) {
  let whereCondition: any = { uid: { not: uid } };

  if (userSearch?.searchInput) {
    if (userSearch.searchType === SearchType.Name) {
      whereCondition.name = { contains: userSearch.searchInput, mode: "insensitive" };
    } else if (userSearch.searchType === SearchType.Email) {
      whereCondition.email = { contains: userSearch.searchInput, mode: "insensitive" };
    }
  }

  if (userSearch.active) {
    whereCondition.inactive = false;
  }

  if (userSearch?.role) {
    const dbrole = dbService.getdbRoleType(userSearch.role);
    whereCondition.role = dbrole;
  }

  const [dbUsers, count] = await dbService.getUsers(
    whereCondition,
    userSearch.page,
    userSearch.size
  );

  const users: IAdminUser[] = dbUsers?.map(dbUser => ({
    id: dbUser?.id,
    uid: dbUser?.uid,
    name: dbUser?.name || "",
    email: dbUser?.email,
    role: dbUser?.role ? dbService.getRoleType(dbUser.role) : RoleType.User
  })) || [];

  const userData: IAdminUserData = { data: users, count };
  return helper.jsonResponse<IAdminUserData>(true, userData);
}

export async function getUserAsync(uid: string) {
  // auth user
  const authUser = await fbService.getAuthUser(uid);
  const external = helper.IsExternaLogin(authUser?.providerData);
  const emailVerified = !external ? authUser?.emailVerified : true;
  const providers = helper.getAuthTypes(authUser?.providerData);
  // db user
  const dbUser = await dbService.getUser(uid);
  const role = dbUser?.role ? dbService.getRoleType(dbUser.role) : RoleType.User;
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
  return helper.jsonResponse<IAdminUser>(true, helper.removeUndefined(user));
}

export async function upsertUserAsync(request: IAdminUser) {
  const uid = request?.uid
    ? await updateUserRecordAsync(
        request.uid,
        request?.name,
        request?.emailVerified,
        request?.disabled,
        request?.role
      )
    : await createUserRecordAsync(request?.name, request?.email, request?.password, request?.role);

  return helper.jsonResponse<string>(true, uid);
}

export async function deleteUserAsync(uid: string) {
  await fbService.deleteAuthUser(uid);
  
  const dbUser = await dbService.getUser(uid);
  if (dbUser) {
    await Promise.all([
      dbService.deleteExpenses(dbUser.id),
      dbService.deleteProjects(dbUser.id)
    ]);
    await dbService.deleteUser(dbUser.id);
  }

  return helper.jsonResponse<string>(true, "User deleted!");
}

async function createUserRecordAsync(
  name?: string,
  email?: string,
  password?: string,
  role?: RoleType
) {
  // auth user
  const createRequest: CreateRequest = {
    displayName: name,
    email,
    emailVerified: true,
    disabled: false,
    password
  };
  const authUser = await fbService.createAuthUser(createRequest);
  // db user
  const dbrole = dbService.getdbRoleType(role || RoleType.User);
  const dbUser = await dbService.createUser(
    authUser.uid,
    email || String.empty,
    name || String.empty,
    dbrole
  );
  return authUser.uid;
}

async function updateUserRecordAsync(
  uid: string,
  name?: string,
  emailVerified?: boolean,
  disabled?: boolean,
  role?: RoleType
) {
  // auth user
  const updateRequest: UpdateRequest = {
    displayName: name,
    emailVerified,
    disabled
  };
  const authUser = await fbService.updateAuthUser(uid, updateRequest);
  // db user
  const dbrole = dbService.getdbRoleType(role || RoleType.User);
  const dbUser = await dbService.updateUser(uid, name || String.empty, dbrole);
  return authUser.uid;
}
