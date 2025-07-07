import { IExpense, IExpenseData, IExpenseReport, IExpenseSearch } from "../models";
import { helper } from "../utils";
import * as dbService from "./prisma";

export async function getExpensesAsync(userId: string, expenseSearch: IExpenseSearch) {
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
  const [dbExpenses, count] = await dbService.getExpenses(
    whereCondition,
    expenseSearch.page,
    expenseSearch.size
  );
  const expenses: IExpense[] = dbExpenses?.map(dbExpense => {
    return {
      id: dbExpense?.id,
      categoryId: dbExpense?.categoryId || String.empty,
      projectId: dbExpense?.projectId || String.empty,
      projectName: dbExpense?.project?.name || String.empty,
      price: dbExpense?.price || 0,
      notes: dbExpense?.notes || String.empty,
      entryDate: dbExpense?.entryDate ? helper.formatDate(dbExpense?.entryDate) : String.empty
    };
  });
  const expenseData: IExpenseData = { data: helper.removeUndefined(expenses), count };
  return helper.jsonResponse<IExpenseData>(true, expenseData);
}

export async function getExpenseAsync(expenseId: string) {
  const dbExpense = await dbService.getExpense(expenseId);
  const expense: IExpense = {
    id: dbExpense?.id,
    categoryId: dbExpense?.categoryId || String.empty,
    projectId: dbExpense?.projectId || String.empty,
    price: dbExpense?.price || 0,
    notes: dbExpense?.notes || String.empty,
    entryDate: dbExpense?.entryDate ? helper.formatDate(dbExpense?.entryDate) : String.empty
  };
  return helper.jsonResponse<IExpense>(true, helper.removeUndefined(expense));
}

export async function upsertExpenseAsync(userId: string, expense: IExpense) {
  const dbExpense = await dbService.upsertExpense(userId, expense);
  return helper.jsonResponse<IExpense>(true, { id: dbExpense.id });
}

export async function deleteExpenseAsync(expenseId: string) {
  await dbService.deleteExpense(expenseId);
  return helper.jsonResponse<string>(true, "Expense has been deleted!");
}

export async function getExpenseReportAsync(userId: string, expenseSearch: IExpenseSearch) {
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
  const dbExpenses = await dbService.getExpenseTotalByCategoryId(whereCondition);
  const expenses = helper.removeUndefined(dbExpenses);

  // get expense and income total
  const dbExpense = await dbService.getExpenseTotal(whereCondition);
  const dbIncome = await dbService.getIncomeTotal(whereCondition);

  return helper.jsonResponse<IExpenseReport>(true, {
    data: expenses,
    expense: dbExpense,
    income: dbIncome
  });
}
