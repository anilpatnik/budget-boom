import { ServiceType } from "@/util";
import { ILookup } from "@/models";
import { authApi } from "./index";
import { code } from "ionicons/icons";

export const getPubCategoriesAsync = async (): Promise<ILookup[]> => {
  const url = `${ServiceType.Pub}${ServiceType.Categories}`;
  const response = await authApi.get(url);
  return response?.data?.resource?.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      icon: item.icon
    };
  });
};

export const getPubProjectsAsync = async (): Promise<ILookup[]> => {
  const url = `${ServiceType.Pub}${ServiceType.Projects}`;
  const response = await authApi.get(url);
  return response?.data?.resource?.map((item: any) => {
    return {
      id: item.id,
      name: item.name
    };
  });
};
