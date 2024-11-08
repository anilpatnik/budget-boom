import { ServiceType } from "@/util";
import { Expense, IExpense, IExpenseData, IExpenseSearch } from "@/models";
import { authApi } from "./index";

export const getExpensesAsync = async (payload: IExpenseSearch): Promise<IExpenseData> => {
  const response = await authApi.post(ServiceType.Expenses, payload);
  if (response?.data?.resource) return response?.data?.resource;
  return { data: [{ ...Expense }], count: 0 };
};

export const getExpenseAsync = async (id: string): Promise<IExpense> => {
  try {
    const url = `${ServiceType.Expenses}/${id}`;
    const response = await authApi.get(url);
    const { success, resource } = response.data;
    if (success) return resource;
  } catch (error) {
    const err = error as Error;
  }
  return { ...Expense };
};

export const upsertExpenseAsync = async (payload: IExpense) => {
  try {
    const response = await authApi.post(ServiceType.Expense, payload);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};

export const deleteExpenseAsync = async (id: string) => {
  try {
    const url = `${ServiceType.Expenses}/${id}`;
    const response = await authApi.delete(url);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};
