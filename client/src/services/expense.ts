import { ServiceType } from "@/util";
import { Expense, IExpense, IExpenseData, IExpenseReport, IExpenseSearch } from "@/models";
import { authApi } from "@/services";

export async function getExpensesAsync(payload: IExpenseSearch): Promise<IExpenseData> {
  const response = await authApi.post(ServiceType.Expenses, payload);
  if (response?.data?.resource) return response?.data?.resource;
  return { data: [{ ...Expense }], count: 0 };
}

export async function getExpenseAsync(id: string): Promise<IExpense> {
  try {
    const url = `${ServiceType.Expenses}/${id}`;
    const response = await authApi.get(url);
    const { success, resource } = response.data;
    if (success) return resource;
  } catch (error) {
    const err = error as Error;
  }
  return { ...Expense };
}

export async function upsertExpenseAsync(payload: IExpense) {
  try {
    const response = await authApi.post(ServiceType.Expense, payload);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
}

export async function deleteExpenseAsync(id: string) {
  try {
    const url = `${ServiceType.Expenses}/${id}`;
    const response = await authApi.delete(url);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
}

export async function getExpenseReportAsync(payload: IExpenseSearch): Promise<IExpenseReport> {
  const url = `${ServiceType.Expenses}${ServiceType.Report}`;
  const response = await authApi.post(url, payload);
  if (response?.data?.resource) return response?.data?.resource;
  return { data: [{ ...Expense }], expense: 0, income: 0 };
}
