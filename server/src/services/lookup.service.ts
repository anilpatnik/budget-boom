import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";
import { ICategory } from "../models";
import { dbhelper, helper } from "../util";

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getPubCategoriesAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = "cache-categories";
    const cachedData: ICategory[] | undefined = cache.get(key);
    if (cachedData) {
      const resJson = helper.responseJson<ICategory[]>(true, cachedData);
      res.json(resJson);
      return;
    }
    const dbCategories = await dbhelper.getPubCategories();
    const categories: ICategory[] = dbCategories?.map(dbCategory => {
      return {
        id: dbCategory.id,
        name: dbCategory.name,
        code: dbCategory.code,
        icon: dbCategory.icon
      };
    });
    cache.set(key, categories, 60 * 60 * 12);
    const resJson = helper.responseJson<ICategory[]>(true, categories || []);
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};
