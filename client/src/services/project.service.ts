import { ServiceType } from "@/util";
import { IPaging, IProject, IProjectData, Project } from "@/models";
import { authApi } from "./index";

export const getPubProjectsAsync = async (): Promise<IProject[]> => {
  const url = `${ServiceType.Pub}${ServiceType.Projects}`;
  const response = await authApi.get(url);
  return response?.data?.resource?.map((item: any) => {
    return {
      id: item.id,
      name: item.name
    };
  });
};

export const getProjectsAsync = async (payload: IPaging): Promise<IProjectData> => {
  const response = await authApi.post(ServiceType.Projects, payload);
  if (response?.data?.resource) return response?.data?.resource;
  return { data: [{ ...Project }], count: 0 };
};

export const getProjectAsync = async (id: string): Promise<IProject> => {
  try {
    const url = `${ServiceType.Projects}/${id}`;
    const response = await authApi.get(url);
    const { success, resource } = response.data;
    if (success) return resource;
  } catch (error) {
    const err = error as Error;
  }
  return { ...Project };
};

export const upsertProjectAsync = async (payload: IProject) => {
  try {
    const response = await authApi.post(ServiceType.Project, payload);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};

export const deleteProjectAsync = async (id: string) => {
  try {
    const url = `${ServiceType.Projects}/${id}`;
    const response = await authApi.delete(url);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};
