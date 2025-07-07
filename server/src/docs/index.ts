import { Controller, Route, Tags, Get, Post, Delete, Path, Security, Body } from "tsoa";
import {
  IAdminUser,
  IAdminUserData,
  IAdminUserSearch,
  IExpense,
  IExpenseData,
  IExpenseReport,
  IExpenseSearch,
  IProject,
  IProjectData,
  IResponse,
  IUser
} from "../models";

// auth
@Route()
@Tags("🔓 Auth Routes")
export class AuthController extends Controller {
  @Post("/signin")
  public async signInAsync(@Body() body: { uid: string }): Promise<IResponse<IUser>> {
    return new Promise<IResponse<IUser>>(resolve => {
      resolve({ success: true });
    });
  }
  @Post("/profile")
  @Security("bearerAuth")
  public async updateProfileAsync(
    @Body() body: { name: string; countryId: string }
  ): Promise<IResponse<string>> {
    return new Promise<IResponse<string>>(resolve => {
      resolve({ success: true });
    });
  }
  @Delete("/profile")
  @Security("bearerAuth")
  public async deleteProfileAsync(): Promise<IResponse<string>> {
    return new Promise<IResponse<string>>(resolve => {
      resolve({ success: true });
    });
  }
}
// user
@Route()
@Security("bearerAuth")
@Tags("👤 User Routes")
export class UserController extends Controller {
  @Post("/users")
  public async getUsersAsync(@Body() body: IAdminUserSearch): Promise<IResponse<IAdminUserData>> {
    return new Promise<IResponse<IAdminUserData>>(resolve => {
      resolve({ success: true });
    });
  }
  /**
   * Get user by ID
   * Retrieves detailed information about a specific user using their ID.
   */
  @Get("/users/{userid}")
  public async getUserAsync(@Path() userid: string): Promise<IResponse<IAdminUser>> {
    return new Promise<IResponse<IAdminUser>>(resolve => {
      resolve({ success: true });
    });
  }
  @Post("/user")
  public async upsertUserAsync(@Body() body: IAdminUser): Promise<IResponse<string>> {
    return new Promise<IResponse<string>>(resolve => {
      resolve({ success: true });
    });
  }
  @Delete("/users/{userid}")
  public async deleteUserAsync(@Path() userid: string): Promise<IResponse<string>> {
    return new Promise<IResponse<string>>(resolve => {
      resolve({ success: true });
    });
  }
}
// project
@Route()
@Security("bearerAuth")
@Tags("🚀 Project Routes")
export class ProjectController extends Controller {
  @Get("/projects/all")
  public async getAllProjectsAsync(): Promise<IResponse<IProjectData>> {
    return new Promise<IResponse<IProjectData>>(resolve => {
      resolve({ success: true });
    });
  }
  @Post("/projects")
  public async getProjectsAsync(
    @Body() body: { page: number; size: number }
  ): Promise<IResponse<IProjectData>> {
    return new Promise<IResponse<IProjectData>>(resolve => {
      resolve({ success: true });
    });
  }
  @Get("/projects/{projectid}")
  public async getProjectAsync(@Path() projectid: string): Promise<IResponse<string>> {
    return new Promise<IResponse<string>>(resolve => {
      resolve({ success: true });
    });
  }
  @Post("/project")
  public async upsertProjectAsync(@Body() body: IProject): Promise<IResponse<string>> {
    return new Promise<IResponse<string>>(resolve => {
      resolve({ success: true });
    });
  }
  @Delete("/projects/{projectid}")
  public async deleteProjectAsync(@Path() projectid: string): Promise<IResponse<string>> {
    return new Promise<IResponse<string>>(resolve => {
      resolve({ success: true });
    });
  }
}
// expense
@Route()
@Security("bearerAuth")
@Tags("📈 Expense Routes")
export class ExpenseController extends Controller {
  @Post("/expenses")
  public async getExpensesAsync(@Body() body: IExpenseSearch): Promise<IResponse<IExpenseData>> {
    return new Promise<IResponse<IExpenseData>>(resolve => {
      resolve({ success: true });
    });
  }
  @Get("/expenses/{expenseid}")
  public async getExpenseAsync(@Path() expenseid: string): Promise<IResponse<IExpense>> {
    return new Promise<IResponse<IExpense>>(resolve => {
      resolve({ success: true });
    });
  }
  @Post("/expense")
  public async upsertExpenseAsync(@Body() body: IExpense): Promise<IResponse<IExpense>> {
    return new Promise<IResponse<IExpense>>(resolve => {
      resolve({ success: true });
    });
  }
  @Delete("/expenses/{expenseid}")
  public async deleteExpenseAsync(@Path() expenseid: string): Promise<IResponse<string>> {
    return new Promise<IResponse<string>>(resolve => {
      resolve({ success: true });
    });
  }
  @Post("/expenses/report")
  public async getExpenseReportAsync(
    @Body() body: IExpenseSearch
  ): Promise<IResponse<IExpenseReport>> {
    return new Promise<IResponse<IExpenseReport>>(resolve => {
      resolve({ success: true });
    });
  }
}
