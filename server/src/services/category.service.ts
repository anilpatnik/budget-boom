import { NextFunction, Request, Response } from "express";
import { helper, dbhelper } from "../util";
import { ICategory } from "../models";

export const getCategoriesAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const dbCategories = await dbhelper.getCategories();
    const categories: ICategory[] = dbCategories?.map(dbCategory => {
      return {
        id: dbCategory?.id,
        name: dbCategory?.name,
        icon: dbCategory?.icon
      };
    });
    const resJson = helper.responseJson<ICategory[]>(true, helper.removeUndefined(categories));
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const getCategoryAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const userId = req?.auth?.id || String.empty;
    const categoryId = req.params.categoryid;
    const dbCategory = await dbhelper.getCategory(categoryId);
    const category: ICategory = {
      id: dbCategory?.id,
      name: dbCategory?.name,
      icon: dbCategory?.icon
    };
    const resJson = helper.responseJson<ICategory>(true, helper.removeUndefined(category));
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const upsertCategoryAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const category: ICategory = req.body;
    const dbCategory = await dbhelper.upsertCategory(category);
    const resJson = helper.responseJson<ICategory>(true, { id: dbCategory.id });
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const deleteCategoryAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const categoryId = req.params.categoryid;
    // check if expenses exists
    const count = await dbhelper.getExpenseCountByCategoryId(categoryId || String.empty);
    if (count > 0) throw new Error("Category has expenses!");
    // delete category
    await dbhelper.deleteCategory(categoryId);
    const resJson = helper.responseJson<string>(true, "Category has been deleted!");
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};
