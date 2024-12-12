import { PrismaClient } from "@prisma/client";
import { mockExpenses, mockProjects } from "./db";

const prisma = new PrismaClient();

async function main() {
  //const projects = await mockProjects(15);
  //await prisma.project.deleteMany({});
  //await prisma.project.createMany({ data: projects });
  //const expenses = await mockExpenses(2000);
  //await prisma.expense.deleteMany({});
  //await prisma.expense.createMany({ data: expenses });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  });
