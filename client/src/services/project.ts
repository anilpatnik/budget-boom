import { IProject, IProjectData, Project } from "@/models";
import { constants } from "@/utils";
import { ServiceType } from "@/utils/enums";
import { authApi } from "@/services";

export async function getAllProjectsAsync(): Promise<IProject[]> {
  const url = `${ServiceType.Projects}/all`;
  const response = await authApi.get(url);
  if (response?.data?.resource) return response?.data?.resource;
  return [{ ...Project }];
}

export async function getProjectsAsync(
  page: number = 0,
  size: number = constants.PAGE_SIZE
): Promise<IProjectData> {
  const response = await authApi.post(ServiceType.Projects, { page, size });
  if (response?.data?.resource) return response?.data?.resource;
  return { data: [{ ...Project }], count: 0 };
}

export async function getProjectAsync(id: string): Promise<IProject> {
  try {
    const url = `${ServiceType.Projects}/${id}`;
    const response = await authApi.get(url);
    const { success, resource } = response.data;
    if (success) return resource;
  } catch (error) {
    const err = error as Error;
  }
  return { ...Project };
}

export async function upsertProjectAsync(payload: IProject) {
  try {
    const response = await authApi.post(ServiceType.Project, payload);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
}

export async function deleteProjectAsync(id: string) {
  try {
    const url = `${ServiceType.Projects}/${id}`;
    const response = await authApi.delete(url);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
}
