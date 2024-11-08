import { NextFunction, Request, Response } from "express";
import { helper, dbhelper } from "../util";
import { IExpense, IExpenseData, IExpenseSearch } from "../models";

export const getExpensesAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const expenseSearch: IExpenseSearch = req.body;
    let whereCondition = {};
    // user filter
    whereCondition = {
      ...whereCondition,
      userId: { equals: userId }
    };
    // project filter
    if (expenseSearch.projectId) {
      whereCondition = {
        ...whereCondition,
        projectId: { equals: expenseSearch.projectId }
      };
    }
    // category filter
    if (expenseSearch.categoryId) {
      whereCondition = {
        ...whereCondition,
        categoryId: { equals: expenseSearch.categoryId, mode: "insensitive" }
      };
    }
    // date filter
    if (expenseSearch.startDate && expenseSearch.endDate) {
      whereCondition = {
        ...whereCondition,
        entryDate: {
          gte: new Date(helper.formatDate(expenseSearch.startDate)),
          lte: new Date(helper.formatDate(expenseSearch.endDate))
        }
      };
    }
    // get expenses
    const [dbExpenses, count] = await dbhelper.getExpenses(
      whereCondition,
      expenseSearch.page,
      expenseSearch.size
    );
    const expenses: IExpense[] = dbExpenses?.map(dbExpense => {
      return {
        id: dbExpense?.id,
        projectName: dbExpense?.project?.name,
        categoryName: dbExpense?.category?.name,
        categoryIcon: dbExpense?.category?.icon,
        price: dbExpense?.price || 0,
        taxable: dbExpense?.taxable || false,
        notes: dbExpense?.notes || String.empty,
        entryDate: dbExpense?.entryDate ? helper.formatDate(dbExpense?.entryDate) : String.empty
      };
    });
    const expenseData: IExpenseData = { data: helper.removeUndefined(expenses), count };
    const resJson = helper.responseJson<IExpenseData>(true, expenseData);
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const getExpenseAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const userId = req?.auth?.id || String.empty;
    const expenseId = req.params.expenseid;
    const dbExpense = await dbhelper.getExpense(expenseId);
    const expense: IExpense = {
      id: dbExpense?.id,
      projectId: dbExpense?.projectId || String.empty,
      categoryId: dbExpense?.categoryId || String.empty,
      price: dbExpense?.price || 0,
      taxable: dbExpense?.taxable || false,
      notes: dbExpense?.notes || String.empty,
      entryDate: dbExpense?.entryDate ? helper.formatDate(dbExpense?.entryDate) : String.empty
    };
    const resJson = helper.responseJson<IExpense>(true, helper.removeUndefined(expense));
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const upsertExpenseAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.auth?.id || String.empty;
    const expense: IExpense = req.body;
    const dbExpense = await dbhelper.upsertExpense(userId, expense);
    const resJson = helper.responseJson<IExpense>(true, { id: dbExpense.id });
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};

export const deleteExpenseAsync = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const userId = req?.auth?.id || String.empty;
    const expenseId = req.params.expenseid;
    await dbhelper.deleteExpense(expenseId);
    const resJson = helper.responseJson<string>(true, "Expense has been deleted!");
    res.json(resJson);
  } catch (error) {
    return next(error);
  }
};
