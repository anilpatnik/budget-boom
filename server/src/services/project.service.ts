import { NextFunction, Request, Response } from "express";
import { helper, dbhelper, CrudType } from "../util";
import { IProject } from "../models";

export const getProjectsAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const dbProjects = await dbhelper.getProjects(userId);
    const projects: IProject[] = dbProjects?.map(dbProject => {
      return {
        id: dbProject?.id,
        name: dbProject?.name,
        budget: dbProject?.budget || 0,
        startDate: dbProject?.startDate ? helper.formatDate(dbProject?.startDate) : String.empty,
        endDate: dbProject?.endDate ? helper.formatDate(dbProject?.endDate) : String.empty,
        inactive: dbProject?.inactive
      };
    });
    const resJson = helper.responseJson<IProject[]>(true, helper.removeUndefined(projects));
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const getProjectAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectid;
    const dbProject = await dbhelper.getProject(projectId);
    const project: IProject = {
      id: dbProject?.id,
      name: dbProject?.name,
      prevName: dbProject?.name,
      budget: dbProject?.budget || 0,
      startDate: dbProject?.startDate ? helper.formatDate(dbProject?.startDate) : String.empty,
      endDate: dbProject?.endDate ? helper.formatDate(dbProject?.endDate) : String.empty,
      inactive: dbProject?.inactive
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
      const count = await dbhelper.getProjectByName(userId, project.name || String.empty);
      if (count > 0) throw new Error("Project with the same name exists!");
    }
    // upsert project
    const dbProject = await dbhelper.upsertProject(userId, project);
    const resJson = helper.responseJson<IProject>(true, { id: dbProject.id });
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const deleteProjectAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectid;
    await dbhelper.deleteProject(projectId);
    const resJson = helper.responseJson<string>(true, "Project has been disabled!");
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};
