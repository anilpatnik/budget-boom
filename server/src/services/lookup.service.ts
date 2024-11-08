import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";
import { ILookup } from "../models";
import { dbhelper, helper } from "../util";

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getPubCategoriesAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = "cache-categories";
    const cachedData: ILookup[] | undefined = cache.get(key);
    if (cachedData) {
      const resJson = helper.responseJson<ILookup[]>(true, cachedData);
      res.json(resJson);
      return;
    }
    const dbCategories = await dbhelper.getPubCategories();
    const categories: ILookup[] = dbCategories?.map(dbCategory => {
      return { id: dbCategory.id, name: dbCategory.name, icon: dbCategory.icon };
    });
    cache.set(key, categories, 60 * 60 * 12);
    const resJson = helper.responseJson<ILookup[]>(true, helper.removeUndefined(categories) || []);
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const getPubProjectsAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const key = `cache-projects-${userId}`;
    const cachedData: ILookup[] | undefined = cache.get(key);
    if (cachedData) {
      const resJson = helper.responseJson<ILookup[]>(true, cachedData);
      res.json(resJson);
      return;
    }
    const dbProjects = await dbhelper.getPubProjects(userId);
    const projects: ILookup[] = dbProjects?.map(dbProject => {
      return { id: dbProject?.id, name: dbProject?.name };
    });
    cache.set(key, projects, 60 * 10 * 1);
    const resJson = helper.responseJson<ILookup[]>(true, helper.removeUndefined(projects) || []);
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};
