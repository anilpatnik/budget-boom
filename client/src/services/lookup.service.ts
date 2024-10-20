import { ServiceType } from "@/util";
import { ICategory } from "@/models";
import { authApi } from "./index";

export const getPubCategoriesAsync = async (): Promise<ICategory[]> => {
  const url = `${ServiceType.Pub}${ServiceType.Categories}`;
  const response = await authApi.get(url);
  return response?.data?.resource?.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      icon: item.icon
    };
  });
};
