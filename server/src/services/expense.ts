import { IExpense, IExpenseData, IExpenseReport, IExpenseSearch } from "../models";
import { helper } from "../utils";
import * as dbService from "./prisma";

export async function getExpensesAsync(userId: string, expenseSearch: IExpenseSearch) {
  let whereCondition: any = { userId };

  if (expenseSearch.projectId) {
    whereCondition.projectId = expenseSearch.projectId;
  }
  if (expenseSearch.categoryId) {
    whereCondition.categoryId = { equals: expenseSearch.categoryId, mode: "insensitive" };
  }
  if (expenseSearch.startDate && expenseSearch.endDate) {
    whereCondition.entryDate = {
      gte: new Date(helper.formatDate(expenseSearch.startDate)),
      lte: new Date(helper.formatDate(expenseSearch.endDate))
    };
  }

  const {
    expenses: dbExpenses,
    hasMore,
    nextCursor
  } = await dbService.getExpensesCursor(
    whereCondition,
    expenseSearch.nextCursor,
    expenseSearch.size
  );

  const expenses: IExpense[] = dbExpenses?.map(dbExpense => ({
    id: dbExpense?.id,
    categoryId: dbExpense?.categoryId || "",
    projectId: dbExpense?.projectId || "",
    projectName: dbExpense?.project?.name || "",
    price: dbExpense?.price || 0,
    notes: dbExpense?.notes || "",
    entryDate: dbExpense?.entryDate ? helper.formatDate(dbExpense?.entryDate) : ""
  })) || [];

  const expenseData: IExpenseData = {
    data: helper.removeUndefined(expenses),
    hasMore,
    nextCursor: {
      id: nextCursor?.id || "",
      entryDate: nextCursor?.entryDate ? helper.formatDate(nextCursor.entryDate) : helper.dateNow()
    }
  };

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
  let whereCondition: any = { userId };

  if (expenseSearch.projectId) {
    whereCondition.projectId = expenseSearch.projectId;
  }
  if (expenseSearch.startDate && expenseSearch.endDate) {
    whereCondition.entryDate = {
      gte: new Date(helper.formatDate(expenseSearch.startDate)),
      lte: new Date(helper.formatDate(expenseSearch.endDate))
    };
  }

  const [categoryTotals, expenseTotal, incomeTotal] = await Promise.all([
    dbService.getExpenseTotalByCategoryId(whereCondition),
    dbService.getExpenseTotal(whereCondition),
    dbService.getIncomeTotal(whereCondition)
  ]);

  return helper.jsonResponse<IExpenseReport>(true, {
    data: helper.removeUndefined(categoryTotals),
    expense: expenseTotal,
    income: incomeTotal
  });
}
