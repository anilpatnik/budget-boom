import { NextFunction, Request, Response } from "express";
import { helper, dbhelper, CrudType } from "../util";
import { IPaging, IProject, IProjectData } from "../models";

const cacheKey = "cache-projects-{0}";

export const getProjectsAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const paging: IPaging = req.body;
    const [dbProjects, count] = await dbhelper.getProjects(userId, paging.page, paging.size);
    const projects: IProject[] = dbProjects?.map(dbProject => {
      return {
        id: dbProject?.id,
        name: dbProject?.name,
        budget: dbProject?.budget || 0,
        startDate: dbProject?.startDate ? helper.formatDate(dbProject?.startDate) : String.empty,
        endDate: dbProject?.endDate ? helper.formatDate(dbProject?.endDate) : String.empty
      };
    });
    const projectData: IProjectData = { data: helper.removeUndefined(projects), count };
    const resJson = helper.responseJson<IProjectData>(true, projectData);
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const getProjectAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const userId = req?.auth?.id || String.empty;
    const projectId = req.params.projectid;
    const dbProject = await dbhelper.getProject(projectId);
    const project: IProject = {
      id: dbProject?.id,
      name: dbProject?.name,
      prevName: dbProject?.name,
      budget: dbProject?.budget || 0,
      startDate: dbProject?.startDate ? helper.formatDate(dbProject?.startDate) : String.empty,
      endDate: dbProject?.endDate ? helper.formatDate(dbProject?.endDate) : String.empty
    };
    const resJson = helper.responseJson<IProject>(true, helper.removeUndefined(project));
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const upsertProjectAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const project: IProject = req.body;
    // check if project exists and active
    if (
      project.type === CrudType.Create ||
      (project.type === CrudType.Update && project.prevName !== project.name)
    ) {
      const count = await dbhelper.getProjectCountByName(userId, project.name || String.empty);
      if (count > 0) throw new Error("Project with the same name exists!");
    }
    // upsert project
    const dbProject = await dbhelper.upsertProject(userId, project);
    // clear cache
    const key = cacheKey.replace("{0}", userId);
    helper.cache.del(key);
    // return
    const resJson = helper.responseJson<IProject>(true, { id: dbProject.id });
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const deleteProjectAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const projectId = req.params.projectid;
    // check if expenses exists
    const count = await dbhelper.getExpenseCountByProjectId(userId, projectId);
    if (count > 0) throw new Error("Project has expenses!");
    // delete project
    await dbhelper.deleteProject(projectId);
    // clear cache
    const key = cacheKey.replace("{0}", userId);
    helper.cache.del(key);
    // return
    const resJson = helper.responseJson<string>(true, "Project has been deleted!");
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const getPubProjectsAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const key = cacheKey.replace("{0}", userId);
    const cachedData: IProject[] | undefined = helper.cache.get(key);
    if (cachedData) {
      const resJson = helper.responseJson<IProject[]>(true, cachedData);
      res.json(resJson);
      return;
    }
    const dbProjects = await dbhelper.getAllProjects(userId);
    const projects: IProject[] = dbProjects?.map(dbProject => {
      return { id: dbProject?.id, name: dbProject?.name };
    });
    helper.cache.set(key, projects, 60 * 60 * 1);
    const resJson = helper.responseJson<IProject[]>(true, helper.removeUndefined(projects) || []);
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};
