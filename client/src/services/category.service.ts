import { ServiceType } from "@/util";
import { ICategory, Category } from "@/models";
import { authApi } from "./index";

export const getCategoriesAsync = async (): Promise<ICategory[]> => {
  const response = await authApi.get(ServiceType.Categories);
  return response?.data?.resource ?? [{ ...Category }];
};

export const getCategoryAsync = async (id: string): Promise<ICategory> => {
  try {
    const url = `${ServiceType.Categories}/${id}`;
    const response = await authApi.get(url);
    const { success, resource } = response.data;
    if (success) return resource;
  } catch (error) {
    const err = error as Error;
  }
  return { ...Category };
};

export const upsertCategoryAsync = async (payload: ICategory) => {
  try {
    const response = await authApi.post(ServiceType.Category, payload);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};

export const deleteCategoryAsync = async (id: string) => {
  try {
    const url = `${ServiceType.Categories}/${id}`;
    const response = await authApi.delete(url);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};
