import { AuthType, CrudType, RoleType, SearchType } from "@/util";

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
export const Lookup: ILookup = {
  id: String.empty,
  name: String.empty,
  code: String.empty,
  icon: String.empty
};

export interface IUser {
  name?: string;
  email?: string;
  photo?: string;
  role?: RoleType;
  token?: string;
  auth?: boolean;
  external?: boolean;
}
export const User: IUser = {
  name: String.empty,
  email: String.empty,
  photo: String.empty,
  role: RoleType.User,
  token: String.empty,
  auth: false,
  external: false
};

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
  type?: CrudType;
}
export const AdminUser: IAdminUser = {
  id: String.empty,
  uid: String.empty,
  name: String.empty,
  email: String.empty,
  password: String.empty,
  photo: String.empty,
  emailVerified: true,
  disabled: false,
  providers: [],
  role: RoleType.User,
  lastUpdated: String.empty,
  type: CrudType.Read
};
export interface IAdminUserData extends IAggregate {
  data?: IAdminUser[];
}

export interface IAdminUserSearch {
  searchType?: SearchType;
  searchInput?: string;
  role?: RoleType;
  active?: boolean;
  page?: number;
  size?: number;
}
export const AdminUserSearch: IAdminUserSearch = {
  searchType: SearchType.Name,
  searchInput: String.empty,
  role: RoleType.User,
  active: false,
  page: 0,
  size: 10
};

export interface ICategory {
  id?: string;
  name?: string;
  icon?: string;
  type?: CrudType;
}
export const Category: ICategory = {
  id: String.empty,
  name: String.empty,
  icon: String.empty,
  type: CrudType.Read
};

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
export const Project: IProject = {
  id: String.empty,
  name: String.empty,
  prevName: String.empty,
  budget: 0,
  startDate: String.empty,
  endDate: String.empty,
  inactive: false,
  type: CrudType.Read
};
export interface IProjectData extends IAggregate {
  data?: IProject[];
}

export interface IExpenseSearch {
  startDate?: string;
  endDate?: string;
  projectId?: string;
  categoryId?: string;
  page?: number;
  size?: number;
}
export const ExpenseSearch: IExpenseSearch = {
  startDate: String.empty,
  endDate: String.empty,
  projectId: String.empty,
  categoryId: String.empty,
  page: 0,
  size: 10
};

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
export const Expense: IExpense = {
  id: String.empty,
  entryDate: String.empty,
  price: 0,
  taxable: false,
  notes: String.empty,
  projectId: String.empty,
  projectName: String.empty,
  categoryId: String.empty,
  categoryName: String.empty,
  categoryIcon: String.empty,
  inactive: false,
  lastUpdated: String.empty,
  type: CrudType.Read
};
export interface IExpenseData extends IAggregate {
  data?: IExpense[];
}
