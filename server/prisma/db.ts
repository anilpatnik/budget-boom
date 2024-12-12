import { faker } from "@faker-js/faker";
import { RoleType as dbRoleType } from "@prisma/client";

export const mockExpenses = async (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    entryDate: faker.date.between({ from: "2023-01-01", to: "2025-12-31" }),
    price: parseFloat(faker.finance.amount({ min: -1000, max: 1000, dec: 2 })),
    categoryId: faker.helpers.arrayElement(categories),
    projectId: faker.helpers.arrayElement(projects),
    taxable: faker.datatype.boolean(),
    userId: "zzzzz-zzzzz-zzzzz-zzzzz"
  }));
};

export const mockProjects = async (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    budget: parseFloat(faker.finance.amount()),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    userId: "zzzzz-zzzzz-zzzzz-zzzzz"
  }));
};

export const mockUsers = async (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    uid: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.enumValue(dbRoleType)
  }));
};

export const categories = [
  "NONE",
  "HOME",
  "INTEREST",
  "FOOD",
  "GROCERIES",
  "CAR",
  "SHOPPING",
  "UTILITIES",
  "EARNINGS",
  "BUSINESS",
  "DONATION",
  "EDUCATION",
  "ENTERTAINMENT",
  "HEALTH",
  "HOTEL",
  "TRAVEL"
];

export const projects = [
  "zzzzz-zzzzz-zzzzz-zzzzz",
  "zzzzz-zzzzz-zzzzz-zzzzz",
  "zzzzz-zzzzz-zzzzz-zzzzz",
  "zzzzz-zzzzz-zzzzz-zzzzz",
  "zzzzz-zzzzz-zzzzz-zzzzz"
];
