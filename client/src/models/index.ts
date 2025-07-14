import { constants } from "@/utils";
import { AuthType, CrudType, RoleType, SearchType } from "@/utils/enums";

export interface IUser {
  name?: string;
  email?: string;
  photo?: string;
  role?: RoleType;
  token?: string;
  countryId?: string;
  currency?: string;
  auth?: boolean;
  external?: boolean;
}
export const User: IUser = {
  name: String.empty,
  email: String.empty,
  photo: String.empty,
  role: RoleType.User,
  token: String.empty,
  countryId: String.empty,
  currency: String.empty,
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
  type: CrudType.Read
};
export interface IAdminUserData {
  data?: IAdminUser[];
  count?: number;
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
  size: constants.PAGE_SIZE
};

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
export const Project: IProject = {
  id: String.empty,
  name: String.empty,
  prevName: String.empty,
  budget: 0,
  actual: 0,
  startDate: String.empty,
  endDate: String.empty,
  inactive: false,
  type: CrudType.Read
};
export interface IProjectData {
  data?: IProject[];
  count?: number;
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
export const Expense: IExpense = {
  id: String.empty,
  entryDate: String.empty,
  price: 0,
  notes: String.empty,
  categoryId: String.empty,
  projectId: String.empty,
  projectName: String.empty,
  type: CrudType.Read
};

export interface IExpenseCursor {
  id?: string;
  entryDate?: string;
}
export interface IExpenseData {
  data?: IExpense[];
  hasMore?: boolean;
  nextCursor?: IExpenseCursor;
}
export interface IExpenseReport {
  data?: IExpense[];
  expense?: number;
  income?: number;
}
export interface IExpenseSearch {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  projectId?: string;
  skip?: boolean;
  size?: number;
  nextCursor?: IExpenseCursor;
}
export const ExpenseSearch: IExpenseSearch = {
  startDate: String.empty,
  endDate: String.empty,
  categoryId: String.empty,
  projectId: String.empty,
  skip: false,
  size: constants.PAGE_SIZE
};
