import { Request, Response, NextFunction } from "express";
import { IProject } from "../models";
import { projectService } from "../services";

export async function getAllProjectsAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req?.auth?.id || String.empty;
    const result = await projectService.getAllProjectsAsync(userId);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getProjectsAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req?.auth?.id || String.empty;
    const { page, size } = req.body;
    const result = await projectService.getProjectsAsync(userId, page, size);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getProjectAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const projectId = req.params.projectid;
    const result = await projectService.getProjectAsync(projectId);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function upsertProjectAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req?.auth?.id || String.empty;
    const project: IProject = req.body;
    const result = await projectService.upsertProjectAsync(userId, project);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function deleteProjectAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req?.auth?.id || String.empty;
    const projectId = req.params.projectid;
    const result = await projectService.deleteProjectAsync(userId, projectId);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}
