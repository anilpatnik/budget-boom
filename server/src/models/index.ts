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

export interface IAdminUserData extends IAggregate {
  data?: IAdminUser[];
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
  type?: CrudType;
}

export interface IProjectData extends IAggregate {
  data?: IProject[];
}

export interface IExpenseSearch extends IPaging {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  projectId?: string;
  taxable?: boolean;
}

export interface IExpense {
  id?: string;
  entryDate?: string;
  price?: number;
  taxable?: boolean;
  notes?: string;
  categoryId?: string;
  projectId?: string;
  projectName?: string;
  type?: CrudType;
}

export interface IExpenseData extends IAggregate {
  data?: IExpense[];
}
