import { AdminUser, IAdminUser, IAdminUserData, IAdminUserSearch } from "@/models";
import { ServiceType } from "@/utils/enums";
import { authApi } from "@/services";

export async function getUsersAsync(payload: IAdminUserSearch): Promise<IAdminUserData> {
  const response = await authApi.post(ServiceType.Users, payload);
  if (response?.data?.resource) return response?.data?.resource;
  return { data: [{ ...AdminUser }], count: 0 };
}

export async function getUserAsync(id: string): Promise<IAdminUser> {
  try {
    const url = `${ServiceType.Users}/${id}`;
    const response = await authApi.get(url);
    const { success, resource } = response.data;
    if (success) return resource;
  } catch (error) {
    const err = error as Error;
  }
  return { ...AdminUser };
}

export async function updateUserAsync(user: IAdminUser) {
  try {
    const response = await authApi.post(ServiceType.User, user);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
}

export async function deleteUserAsync(id: string) {
  try {
    const url = `${ServiceType.Users}/${id}`;
    const response = await authApi.delete(url);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
}
