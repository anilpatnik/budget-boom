import { RoleType as dbRoleType } from "@prisma/client";
import { parseDate } from "./helper";
import prisma from "./db.client";
import { RoleType } from "./enums";
import { IExpense, IProject } from "../models";

//#region enum mapping

export const getRoleType = (type: dbRoleType): RoleType =>
  type === "ADMIN" ? RoleType.Admin : RoleType.User;

export const getdbRoleType = (type: RoleType): dbRoleType =>
  type === RoleType.Admin ? dbRoleType.ADMIN : dbRoleType.USER;

//#endregion

//#region user authentication

export const getUser = async (uid: string) =>
  await prisma.user.findFirst({
    where: { uid }
  });

export const updateProfile = async (uid: string, name?: string, countryId?: string) =>
  await prisma.user.update({
    where: { uid },
    data: { name, countryId }
  });

//#endregion

//#region user management

export const getUsers = async (where: object = {}, page: number = 0, size: number = 10) =>
  await prisma.$transaction([
    prisma.user.findMany({
      skip: page, // page * size,
      take: size,
      where,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.user.count({ where })
  ]);

export const createUser = async (uid: string, email: string, name?: string, role?: dbRoleType) =>
  await prisma.user.create({ data: { uid, email, name, role: role || dbRoleType.USER } });

export const updateUser = async (uid: string, name?: string, role?: dbRoleType) =>
  await prisma.user.update({
    where: { uid },
    data: { name, role: role || dbRoleType.USER }
  });

export const deleteUser = async (id: string) => await prisma.user.delete({ where: { id } });

//#endregion

//#region project management

export const getAllProjects = async (userId: string) =>
  await prisma.project.findMany({
    where: { inactive: false, userId },
    orderBy: { name: "asc" }
  });

export const getProjects = async (userId: string, page: number = 0, size: number = 10) =>
  await prisma.$transaction([
    prisma.project.findMany({
      skip: page, // page * size,
      take: size,
      where: { inactive: false, userId },
      orderBy: { name: "asc" }
    }),
    prisma.project.count({ where: { inactive: false, userId } })
  ]);

export const getProject = async (id: string) => await prisma.project.findUnique({ where: { id } });

export const getProjectCountByName = async (userId: string, name: string) =>
  await prisma.project.count({
    where: { userId, name: { equals: name, mode: "insensitive" }, inactive: false }
  });

export const upsertProject = async (userId: string, project: IProject) => {
  const buildProjectData = (project: IProject) => ({
    name: project?.name || "",
    budget: project?.budget || 0,
    startDate: parseDate(project?.startDate),
    endDate: parseDate(project?.endDate)
  });
  const projectData = buildProjectData(project);
  return await prisma.project.upsert({
    where: { id: project.id, userId },
    update: projectData,
    create: { userId, ...projectData }
  });
};

export const deleteProject = async (id: string) => await prisma.project.delete({ where: { id } });

export const deleteProjects = async (userId: string) =>
  await prisma.project.deleteMany({ where: { userId } });

//#endregion

//#region expense management

export const getExpenses = async (where: object = {}, page: number = 0, size: number = 10) =>
  await prisma.$transaction([
    prisma.expense.findMany({
      include: { project: true },
      skip: page, // page * size,
      take: size,
      where,
      orderBy: { entryDate: "desc" }
    }),
    prisma.expense.count({ where })
  ]);

export const getExpense = async (id: string) => await prisma.expense.findUnique({ where: { id } });

export const getExpenseCountByProjectId = async (userId: string, projectId: string) =>
  await prisma.expense.count({ where: { userId, projectId } });

export const getExpenseTotalByProjectId = async (userId: string, projectId: string) => {
  const result = await prisma.expense.aggregate({
    where: { userId, projectId },
    _sum: { price: true }
  });
  return result._sum.price || 0;
};

export const upsertExpense = async (userId: string, expense: IExpense) => {
  const { id, projectId, categoryId, price = 0, taxable = false, notes, entryDate } = expense;
  const expenseData: any = {
    userId,
    categoryId,
    price,
    taxable,
    notes,
    entryDate: parseDate(entryDate)
  };
  if (projectId) expenseData.projectId = projectId;
  return prisma.expense.upsert({
    where: { id, userId },
    update: expenseData,
    create: expenseData
  });
};

export const deleteExpense = async (id: string) => await prisma.expense.delete({ where: { id } });

export const deleteExpenses = async (userId: string) =>
  await prisma.expense.deleteMany({ where: { userId } });

//#endregion
