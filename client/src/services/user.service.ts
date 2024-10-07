import { ServiceType } from "@/util";
import { AdminUser, IAdminUser, IAdminUserSearch } from "@/models";
import { authApi } from "./index";

// user profile
export const getUsersAsync = async (payload: IAdminUserSearch): Promise<IAdminUser[]> => {
  const response = await authApi.post(ServiceType.UsersUrl, payload);
  return response?.data?.resource ?? [{ ...AdminUser }];
};

export const getUserAsync = async (id: string): Promise<IAdminUser> => {
  try {
    const url = `${ServiceType.UsersUrl}/${id}`;
    const response = await authApi.get(url);
    const { success, resource } = response.data;
    if (success) return resource;
  } catch (error) {
    const err = error as Error;
  }
  return { ...AdminUser };
};

export const updateUserAsync = async (user: IAdminUser) => {
  try {
    const response = await authApi.post(ServiceType.UserUrl, user);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};

export const deleteUserAsync = async (id: string) => {
  try {
    const url = `${ServiceType.UsersUrl}/${id}`;
    const response = await authApi.delete(url);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};
