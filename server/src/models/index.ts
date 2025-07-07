import { AuthType, CrudType, RoleType, SearchType } from "../utils/enums";

export interface IResponse<T> {
  success?: boolean;
  resource?: T;
}

export interface IPaging {
  page?: number;
  size?: number;
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
  countryId?: string;
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
}

export interface IAdminUserData {
  data?: IAdminUser[];
  count?: number;
}

export interface IAdminUserSearch extends IPaging {
  searchType?: SearchType;
  searchInput?: string;
  role?: RoleType;
  active?: boolean;
}

export interface IProject {
  id?: string;
  name?: string;
  prevName?: string;
  budget?: number;
  actual?: number;
  startDate?: string;
  endDate?: string;
  inactive?: boolean;
  type?: CrudType;
}

export interface IProjectData {
  data?: IProject[];
  count?: number;
}

export interface IExpenseSearch extends IPaging {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  projectId?: string;
}

export interface IExpense {
  id?: string;
  entryDate?: string;
  price?: number;
  notes?: string;
  categoryId?: string;
  projectId?: string;
  projectName?: string;
  type?: CrudType;
}

export interface IExpenseData {
  data?: IExpense[];
  count?: number;
}

export interface IExpenseReport {
  data?: IExpense[];
  expense?: number;
  income?: number;
}
