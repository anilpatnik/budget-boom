import { RoleType as dbRoleType } from "@prisma/client";
import { formatDate, dateNow } from "./helper";
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
export const updateProfile = async (uid: string, name?: string) =>
  await prisma.user.update({
    where: { uid },
    data: { name }
  });
//#endregion

//#region user management
export const getUsers = async (where: object = {}, page: number = 0, size: number = 10) =>
  await prisma.user.findMany({
    skip: page * size,
    take: size,
    where,
    orderBy: { updatedAt: "desc" }
  });
export const createUser = async (uid: string, email: string, name?: string, role?: dbRoleType) =>
  await prisma.user.create({ data: { uid, email, name, role: role || dbRoleType.USER } });
export const updateUser = async (uid: string, name?: string, role?: dbRoleType) =>
  await prisma.user.update({
    where: { uid },
    data: { name, role: role || dbRoleType.USER }
  });
export const deleteUser = async (id: string) => await prisma.user.delete({ where: { id } });
//#endregion

//#region lookup management
export const getCategories = async () =>
  await prisma.category.findMany({ where: { inactive: false } });
//#endregion

//#region project management
export const getProjects = async (userId: string) =>
  await prisma.project.findMany({ where: { inactive: false, userId } });
export const getProject = async (id: string) => await prisma.project.findUnique({ where: { id } });
export const getProjectByName = async (userId: string, name: string) =>
  await prisma.project.count({
    where: { userId, name: { equals: name, mode: "insensitive" }, inactive: false }
  });
// prettier-ignore
export const upsertProject = async (userId: string, project: IProject) =>
  await prisma.project.upsert({
    where: { id: project.id, userId },
    update: {
      name: project?.name || String.empty,
      budget: project?.budget || 0,
      startDate: project?.startDate
        ? new Date(formatDate(project?.startDate))
        : new Date(dateNow()),
      endDate: project?.endDate 
      ? new Date(formatDate(project?.endDate)) 
      : new Date(dateNow())
    },
    create: {
      userId,
      name: project?.name || String.empty,
      budget: project?.budget || 0,
      startDate: project?.startDate
        ? new Date(formatDate(project?.startDate))
        : new Date(dateNow()),
      endDate: project?.endDate 
      ? new Date(formatDate(project?.endDate)) 
      : new Date(dateNow())
    }
  });
export const deleteProject = async (id: string) =>
  await prisma.project.update({ where: { id }, data: { inactive: true } });
export const deleteProjects = async (userId: string) =>
  await prisma.project.deleteMany({ where: { userId } });
//#endregion

//#region expense management
export const getExpenses = async (where: object = {}, page: number = 0, size: number = 10) =>
  await prisma.expense.findMany({
    include: { category: true },
    skip: page * size,
    take: size,
    where,
    orderBy: { updatedAt: "desc" }
  });
export const getExpense = async (id: string) => await prisma.expense.findUnique({ where: { id } });
// prettier-ignore
export const upsertExpense = async (userId: string, expense: IExpense) =>
  await prisma.expense.upsert({
    where: { id: expense.id, userId },
    update: {
      projectId: expense?.projectId || String.empty,         
      categoryCode: expense?.categoryCode,
      price: expense?.price || 0,
      notes: expense?.notes,
      entryDate: expense?.entryDate
        ? new Date(formatDate(expense?.entryDate))
        : new Date(dateNow())      
    },
    create: {
      userId,
      projectId: expense?.projectId || String.empty, 
      categoryCode: expense?.categoryCode,     
      price: expense?.price || 0,
      notes: expense?.notes,
      entryDate: expense?.entryDate
        ? new Date(formatDate(expense?.entryDate))
        : new Date(dateNow())  
    }
  });
export const deleteExpense = async (id: string) => await prisma.expense.delete({ where: { id } });
export const deleteExpenses = async (userId: string) =>
  await prisma.expense.deleteMany({ where: { userId } });
//#endregion
