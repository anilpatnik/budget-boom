import { faker } from "@faker-js/faker";
import { RoleType as dbRoleType } from "@prisma/client";

export const mockProjects = async (count: number) => {
  const projects = Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    budget: parseFloat(faker.finance.amount()),
    startDate: faker.date.past(),
    endDate: faker.date.future()
  }));
  return projects;
};

export const mockUsers = async (
  count: number,
  page: number = 0,
  size: number = 10
): Promise<
  [
    {
      id: string;
      uid: string;
      name: string;
      email: string;
      role: dbRoleType;
    }[],
    number
  ]
> => {
  const users = Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    uid: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.enumValue(dbRoleType)
  }));
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const dbUsers = users.slice(startIndex, endIndex);
  return [dbUsers, count];
};
