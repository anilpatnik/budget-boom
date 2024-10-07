import { AuthType, CrudType, RoleType, SearchType } from "../util";

export interface IResponse<T> {
  success?: boolean;
  resource?: T;
}

export interface IToken {
  id?: string;
  uid?: string;
  role?: RoleType;
}

export interface IUser {
  name?: string;
  email?: string;
  photo?: string;
  role?: RoleType;
  token?: string;
}

export interface IAdminUser {
  id?: string;
  uid?: string;
  name?: string;
  email?: string;
  password?: string;
  photo?: string;
  emailVerified?: boolean;
  disabled?: boolean;
  providers?: AuthType[];
  role?: RoleType;
  lastUpdated?: string;
}

export interface IAdminUserSearch {
  searchType?: SearchType;
  searchInput?: string;
  role?: RoleType;
  active?: boolean;
  page?: number;
  size?: number;
}

export interface ICategory {
  id?: string;
  name?: string;
  code?: string;
  icon?: string;
}

export interface IProject {
  id?: string;
  name?: string;
  prevName?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  inactive?: boolean;
  type?: CrudType;
}

export interface IExpenseSearch {
  startDate?: string;
  endDate?: string;
  projectId?: string;
  categoryCode?: string;
  page?: number;
  size?: number;
}

export interface IExpense {
  id?: string;
  entryDate?: string;
  price?: number;
  notes?: string;
  projectId?: string;
  projectName?: string;
  categoryName?: string;
  categoryCode?: string;
  categoryIcon?: string;
  inactive?: boolean;
  lastUpdated?: string;
  type?: CrudType;
}
