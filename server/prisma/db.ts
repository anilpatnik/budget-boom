import { faker } from "@faker-js/faker";
import { RoleType as dbRoleType } from "@prisma/client";

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
