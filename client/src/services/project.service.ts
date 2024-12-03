import { ServiceType, constants } from "@/util";
import { IProject, IProjectData, Project } from "@/models";
import { authApi } from "./index";

export const getAllProjectsAsync = async (): Promise<IProject[]> => {
  const url = `${ServiceType.Projects}/all`;
  const response = await authApi.get(url);
  if (response?.data?.resource) return response?.data?.resource;
  return [{ ...Project }];
};

export const getProjectsAsync = async (
  page: number = 0,
  size: number = constants.PAGE_SIZE
): Promise<IProjectData> => {
  const response = await authApi.post(ServiceType.Projects, { page, size });
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
