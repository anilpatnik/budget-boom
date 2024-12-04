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
    userId: "869146ff-aaa5-4f86-b527-d01c43798d32"
  }));
};

export const mockProjects = async (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    budget: parseFloat(faker.finance.amount()),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    userId: "869146ff-aaa5-4f86-b527-d01c43798d32"
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
  "f0e6897f-2407-4831-a070-8aedbeb91328",
  "1f18df64-8912-42d3-88b4-fa58920dbeac",
  "a00d4ddf-b3e4-43aa-be56-78dd81e399b3",
  "b1cba775-69af-459e-bc3e-a85a4a026434",
  "992a2ca6-b2a7-40e2-b7a1-606c8b20ba64",
  "e37aa392-5e8f-4ead-9db4-2ebbd219907d",
  "cd008c6d-e36e-416a-806e-14d30458253e",
  "4039d89f-dff7-4cb9-9977-a329edd4d4ee",
  "6464e6dd-1f98-4032-842a-66fb35870b89",
  "bd897baa-90a0-4705-8456-69329a4fefb3"
];
