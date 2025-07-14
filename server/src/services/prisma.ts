import { RoleType as dbRoleType } from "@prisma/client";
import { IExpense, IExpenseCursor, IProject } from "../models";
import { prisma } from "../providers";
import { helper, constants } from "../utils";
import { RoleType } from "../utils/enums";

//#region enum mapping

export function getRoleType(type: dbRoleType): RoleType {
  return type === "ADMIN" ? RoleType.Admin : RoleType.User;
}

export function getdbRoleType(type: RoleType): dbRoleType {
  return type === RoleType.Admin ? dbRoleType.ADMIN : dbRoleType.USER;
}

//#endregion

//#region user authentication

export async function getUser(uid: string) {
  return await prisma.user.findFirst({
    where: { uid }
  });
}

export async function updateProfile(uid: string, name?: string, countryId?: string) {
  return await prisma.user.update({
    where: { uid },
    data: { name, countryId }
  });
}

//#endregion

//#region user management

export async function getUsers(
  where: object = {},
  page: number = 0,
  size: number = constants.PAGE_SIZE
) {
  return await prisma.$transaction([
    prisma.user.findMany({
      skip: page, // page * size,
      take: size,
      where,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.user.count({ where })
  ]);
}

export async function createUser(uid: string, email: string, name?: string, role?: dbRoleType) {
  return await prisma.user.create({ data: { uid, email, name, role: role || dbRoleType.USER } });
}

export async function updateUser(uid: string, name?: string, role?: dbRoleType) {
  return await prisma.user.update({
    where: { uid },
    data: { name, role: role || dbRoleType.USER }
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({ where: { id } });
}

//#endregion

//#region project management

export async function getAllProjects(userId: string) {
  return await prisma.project.findMany({
    where: { userId },
    orderBy: { name: "asc" }
  });
}

export async function getProjects(
  userId: string,
  page: number = 0,
  size: number = constants.PAGE_SIZE
) {
  return await prisma.$transaction([
    prisma.project.findMany({
      skip: page, // page * size,
      take: size,
      where: { userId },
      orderBy: { name: "asc" }
    }),
    prisma.project.count({ where: { userId } })
  ]);
}

export async function getProject(id: string) {
  return await prisma.project.findUnique({ where: { id } });
}

export async function getProjectCountByName(userId: string, name: string) {
  return await prisma.project.count({
    where: { userId, name: { equals: name, mode: "insensitive" } }
  });
}

export async function upsertProject(userId: string, project: IProject) {
  const buildProjectData = (project: IProject) => ({
    name: project?.name || "",
    budget: project?.budget || 0,
    startDate: helper.parseDate(project?.startDate),
    endDate: helper.parseDate(project?.endDate),
    inactive: project?.inactive || false
  });
  const projectData = buildProjectData(project);
  return await prisma.project.upsert({
    where: { id: project.id, userId },
    update: projectData,
    create: { userId, ...projectData }
  });
}

export async function deleteProject(id: string) {
  return await prisma.project.delete({ where: { id } });
}

export async function deleteProjects(userId: string) {
  return await prisma.project.deleteMany({ where: { userId } });
}

//#endregion

//#region expense management

export async function getExpenses(
  where: object = {},
  page: number = 0,
  size: number = constants.PAGE_SIZE
) {
  return await prisma.$transaction([
    prisma.expense.findMany({
      include: { project: true },
      skip: page, // page * size,
      take: size,
      where,
      orderBy: [{ entryDate: "desc" }, { id: "desc" }]
    }),
    prisma.expense.count({ where })
  ]);
}

export async function getExpensesCursor(
  where: object = {},
  nextCursor: IExpenseCursor | null = null,
  size: number = constants.PAGE_SIZE
) {
  // cursor to Prisma-compatible cursor
  const parseCursor =
    nextCursor && nextCursor.id
      ? {
          id: nextCursor.id,
          entryDate: helper.parseDate(nextCursor.entryDate)
        }
      : undefined;
  // fetch expenses from database
  const expenses = await prisma.expense.findMany({
    include: { project: true },
    take: size + 1, // fetch one extra to check if more exist
    where,
    orderBy: [{ entryDate: "desc" }, { id: "desc" }],
    cursor: parseCursor ? { entryDate_id: parseCursor } : undefined,
    skip: parseCursor ? 1 : 0 // skip the cursor item itself
  });

  const hasMore = expenses.length > size;
  if (hasMore) expenses.pop(); // remove extra item

  return {
    expenses,
    hasMore,
    nextCursor: hasMore
      ? {
          entryDate: expenses[expenses.length - 1].entryDate,
          id: expenses[expenses.length - 1].id
        }
      : undefined
  };
}

export async function getExpense(id: string) {
  return await prisma.expense.findUnique({ where: { id } });
}

export async function getExpenseCountByProjectId(userId: string, projectId: string) {
  return await prisma.expense.count({ where: { userId, projectId } });
}

export async function getExpenseTotalByProjectId(userId: string, projectId: string) {
  const result = await prisma.expense.aggregate({
    where: { userId, projectId },
    _sum: { price: true }
  });
  return result._sum.price || 0;
}

export async function getExpenseTotalByCategoryId(where: object = {}) {
  const result = await prisma.expense.groupBy({
    by: ["categoryId"],
    where,
    _sum: { price: true }
  });
  return result.map(item => ({
    categoryId: item.categoryId,
    price: item._sum.price || 0
  }));
}

export async function getExpenseTotal(where: object = {}) {
  const result = await prisma.expense.aggregate({
    where: { ...where, price: { lte: 0 } },
    _sum: { price: true }
  });
  return result._sum.price || 0;
}

export async function getIncomeTotal(where: object = {}) {
  const result = await prisma.expense.aggregate({
    where: { ...where, price: { gte: 0 } },
    _sum: { price: true }
  });
  return result._sum.price || 0;
}

export async function upsertExpense(userId: string, expense: IExpense) {
  const { id, projectId, categoryId, price = 0, notes, entryDate } = expense;
  const expenseData: any = {
    userId,
    categoryId,
    projectId: projectId || null,
    price,
    notes,
    entryDate: helper.parseDate(entryDate)
  };
  return prisma.expense.upsert({
    where: { id, userId },
    update: expenseData,
    create: expenseData
  });
}

export async function deleteExpense(id: string) {
  return await prisma.expense.delete({ where: { id } });
}

export async function deleteExpenses(userId: string) {
  return await prisma.expense.deleteMany({ where: { userId } });
}

//#endregion
