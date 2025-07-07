import { Request, Response, NextFunction } from "express";
import { IExpense, IExpenseSearch } from "../models";
import { expenseService } from "../services";

export async function getExpensesAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req?.auth?.id || String.empty;
    const expenseSearch: IExpenseSearch = req.body;
    const result = await expenseService.getExpensesAsync(userId, expenseSearch);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getExpenseAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const expenseId = req.params.expenseid;
    const result = await expenseService.getExpenseAsync(expenseId);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function upsertExpenseAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req?.auth?.id || String.empty;
    const expense: IExpense = req.body;
    const result = await expenseService.upsertExpenseAsync(userId, expense);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function deleteExpenseAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const expenseId = req.params.expenseid;
    const result = await expenseService.deleteExpenseAsync(expenseId);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getExpenseReportAsync(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req?.auth?.id || String.empty;
    const expenseSearch: IExpenseSearch = req.body;
    const result = await expenseService.getExpenseReportAsync(userId, expenseSearch);
    res.json(result);
  } catch (error) {
    return next(error);
  }
}
