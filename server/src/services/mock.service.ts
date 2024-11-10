import { faker } from "@faker-js/faker";

export const mockProjects = async (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    budget: parseFloat(faker.finance.amount()),
    startDate: faker.date.past(),
    endDate: faker.date.future()
  }));
};
