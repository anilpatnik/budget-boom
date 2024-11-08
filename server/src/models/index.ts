import { AuthType, CrudType, RoleType, SearchType } from "../util";

export interface IResponse<T> {
  success?: boolean;
  resource?: T;
}

export interface IPaging {
  page?: number;
  size?: number;
}

export interface IAggregate {
  count?: number;
  total?: number;
}

export interface ILookup {
  id?: string;
  name?: string;
  code?: string;
  icon?: string;
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

export interface IAdminUserData extends IAggregate {
  data?: IAdminUser[];
}

export interface IAdminUserSearch extends IPaging {
  searchType?: SearchType;
  searchInput?: string;
  role?: RoleType;
  active?: boolean;
}

export interface ICategory {
  id?: string;
  name?: string;
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

export interface IProjectData extends IAggregate {
  data?: IProject[];
}

export interface IExpenseSearch extends IPaging {
  startDate?: string;
  endDate?: string;
  projectId?: string;
  categoryId?: string;
}

export interface IExpense {
  id?: string;
  entryDate?: string;
  price?: number;
  taxable?: boolean;
  notes?: string;
  projectId?: string;
  projectName?: string;
  categoryId?: string;
  categoryName?: string;
  categoryIcon?: string;
  inactive?: boolean;
  lastUpdated?: string;
  type?: CrudType;
}

export interface IExpenseData extends IAggregate {
  data?: IExpense[];
}
