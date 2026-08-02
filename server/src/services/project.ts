import { IProject, IProjectData } from "../models";
import { helper } from "../utils";
import { CrudType } from "../utils/enums";
import * as dbService from "./prisma";

export async function getAllProjectsAsync(userId: string) {
  const dbProjects = await dbService.getAllProjects(userId);
  const projects: IProject[] = dbProjects?.map(dbProject => {
    return { id: dbProject?.id, name: dbProject?.name, inactive: dbProject?.inactive || false };
  });
  return helper.jsonResponse<IProjectData>(true, helper.removeUndefined(projects));
}

export async function getProjectsAsync(userId: string, page: number, size: number) {
  const [dbProjects, count] = await dbService.getProjects(userId, page, size);
  
  const projectIds = dbProjects.map(p => p.id);
  const actuals = await Promise.all(
    projectIds.map(id => dbService.getExpenseTotalByProjectId(userId, id))
  );

  const projects: IProject[] = dbProjects.map((dbProject, idx) => ({
    id: dbProject?.id,
    name: dbProject?.name,
    prevName: dbProject?.name,
    budget: dbProject?.budget || 0,
    actual: actuals[idx],
    startDate: dbProject?.startDate ? helper.formatDate(dbProject?.startDate) : "",
    endDate: dbProject?.endDate ? helper.formatDate(dbProject?.endDate) : "",
    inactive: dbProject?.inactive || false
  }));

  const projectData: IProjectData = { data: helper.removeUndefined(projects), count };
  return helper.jsonResponse<IProjectData>(true, projectData);
}

export async function getProjectAsync(projectId: string) {
  const dbProject = await dbService.getProject(projectId);
  const project: IProject = {
    id: dbProject?.id,
    name: dbProject?.name,
    prevName: dbProject?.name,
    budget: dbProject?.budget || 0,
    startDate: dbProject?.startDate ? helper.formatDate(dbProject?.startDate) : "",
    endDate: dbProject?.endDate ? helper.formatDate(dbProject?.endDate) : "",
    inactive: dbProject?.inactive || false
  };
  return helper.jsonResponse<IProject>(true, helper.removeUndefined(project));
}

export async function upsertProjectAsync(userId: string, project: IProject) {
  const isNameChanged = project.type === CrudType.Create || project.prevName !== project.name;
  
  if (isNameChanged) {
    const count = await dbService.getProjectCountByName(userId, project.name || "");
    if (count > 0) throw new Error("Project with the same name exists!");
  }

  const dbProject = await dbService.upsertProject(userId, project);
  return helper.jsonResponse<IProject>(true, { id: dbProject.id });
}

export async function deleteProjectAsync(userId: string, projectId: string) {
  // check if expenses exists
  const count = await dbService.getExpenseCountByProjectId(userId, projectId);
  if (count > 0) throw new Error("Project has expenses!");
  // delete project
  await dbService.deleteProject(projectId);
  return helper.jsonResponse<string>(true, "Project has been deleted!");
}
