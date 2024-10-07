import { ServiceType } from "@/util";
import { ICategory } from "@/models";
import { authApi } from "./index";

export const getCategoriesAsync = async (): Promise<ICategory[]> => {
  const response = await authApi.get(ServiceType.CategoriesUrl);
  return response?.data?.resource?.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      icon: item.icon
    };
  });
};
